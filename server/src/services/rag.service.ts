import mammoth from 'mammoth';
import { AIService } from './ai.service.js';
import { DocumentsRepo, DocumentChunksRepo } from '../models/repositories.js';
import { IDocumentChunk, IDocumentCitation } from '../models/types.js';

export function validateExtractedText(text: string): { isValid: boolean; reason?: string; cleanedText: string } {
  if (!text || text.trim().length < 30) {
    return {
      isValid: false,
      reason: 'The file contains insufficient extractable text (fewer than 30 characters). It may be empty or contain non-text images.',
      cleanedText: '',
    };
  }

  // Detect raw unparsed PDF binary stream signatures that indicate extraction failed
  const pdfMarkerRegex = /\b(endobj|xref|trailer|startxref|\/Type\s*\/|\/Catalog|\/Pages|\/FlateDecode|\/Filter|\/Length)\b/g;
  const pdfMarkers = text.match(pdfMarkerRegex) || [];
  if (pdfMarkers.length >= 3) {
    return {
      isValid: false,
      reason: 'The PDF appears to be a scanned image or contains encrypted character streams that cannot be parsed as text. Please upload a searchable digital PDF or text file.',
      cleanedText: '',
    };
  }

  // Filter out non-printable ASCII/Unicode control characters
  const cleaned = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ' ').replace(/\s+/g, ' ').trim();

  // Check printable character ratio
  const printable = cleaned.replace(/[^a-zA-Z0-9\s.,!?:;'"()\-_/[\]{}%&=+*<>#@]/g, '');
  const printableRatio = printable.length / (cleaned.length || 1);
  if (printableRatio < 0.6) {
    return {
      isValid: false,
      reason: 'The extracted text contains excessive unreadable binary symbols or corrupted characters. Please ensure the document contains clean, searchable text.',
      cleanedText: '',
    };
  }

  const words = cleaned.split(/\s+/).filter(w => w.length > 1);
  if (words.length < 8) {
    return {
      isValid: false,
      reason: 'The document does not contain enough recognizable words for academic study.',
      cleanedText: '',
    };
  }

  return { isValid: true, cleanedText: cleaned };
}

export class RAGService {
  static async extractText(buffer: Buffer, mimeType: string, filename: string): Promise<{ text: string; pageCount: number }> {
    if (!buffer || buffer.length === 0) {
      throw new Error('The uploaded document is empty (0 bytes). Please upload a valid document containing readable text.');
    }

    const ext = filename.split('.').pop()?.toLowerCase();

    // 1. Plain Text or Markdown
    if (mimeType.includes('text') || ext === 'txt' || ext === 'md') {
      const rawText = buffer.toString('utf-8');
      const validation = validateExtractedText(rawText);
      if (!validation.isValid) {
        throw new Error(validation.reason);
      }
      const pageCount = Math.max(1, Math.ceil(validation.cleanedText.split(/\s+/).length / 450));
      return { text: validation.cleanedText, pageCount };
    }

    // 2. DOCX (Mammoth)
    if (
      mimeType.includes('wordprocessingml') ||
      mimeType.includes('docx') ||
      ext === 'docx'
    ) {
      try {
        const result = await mammoth.extractRawText({ buffer });
        const rawText = result.value || '';
        const validation = validateExtractedText(rawText);
        if (!validation.isValid) {
          throw new Error(validation.reason);
        }
        const pageCount = Math.max(1, Math.ceil(validation.cleanedText.split(/\s+/).length / 450));
        return { text: validation.cleanedText, pageCount };
      } catch (err: any) {
        throw new Error(`Failed to extract text from DOCX: ${err.message}`);
      }
    }

    // 3. PDF Parsing
    if (mimeType.includes('pdf') || ext === 'pdf') {
      try {
        if (!buffer || buffer.length === 0) {
          throw new Error('The PDF file is empty (0 bytes). Please upload a valid document containing readable text.');
        }
        if (buffer.length < 32) {
          throw new Error('The PDF file is empty or corrupted (file size is too small to contain valid PDF structures).');
        }

        const pdfParseModule: any = await import('pdf-parse');
        let rawText = '';
        let pageCount = 1;

        if (typeof pdfParseModule.default === 'function') {
          const data = await pdfParseModule.default(buffer);
          rawText = data.text || '';
          pageCount = data.numpages || 1;
        } else if (pdfParseModule.PDFParse || (pdfParseModule.default && pdfParseModule.default.PDFParse)) {
          const ParserClass = pdfParseModule.PDFParse || pdfParseModule.default.PDFParse;
          const parser = new ParserClass({ data: buffer });
          const result = await parser.getText();
          rawText = result.text || '';
          pageCount = result.total || 1;
        } else if (typeof pdfParseModule === 'function') {
          const data = await pdfParseModule(buffer);
          rawText = data.text || '';
          pageCount = data.numpages || 1;
        }

        const validation = validateExtractedText(rawText);
        if (!validation.isValid) {
          throw new Error(validation.reason);
        }

        return { text: validation.cleanedText, pageCount: Math.max(1, pageCount) };
      } catch (err: any) {
        let msg = err.message || 'Failed to extract readable text from PDF. Please upload a searchable digital PDF.';
        if (msg.includes('zero bytes') || msg.includes('empty')) {
          msg = 'The uploaded PDF is empty or does not contain readable digital text. Please upload a PDF containing course study material.';
        }
        throw new Error(msg);
      }
    }

    // Default text fallback
    const rawText = buffer.toString('utf-8');
    const validation = validateExtractedText(rawText);
    if (!validation.isValid) {
      throw new Error(validation.reason);
    }
    const pageCount = Math.max(1, Math.ceil(validation.cleanedText.split(/\s+/).length / 450));
    return { text: validation.cleanedText, pageCount };
  }

  static chunkText(text: string, totalPages = 1): Array<{ chunkIndex: number; pageNumber: number; content: string }> {
    const words = text.split(/\s+/).filter(w => w.trim().length > 0);
    const chunkSize = 350; // words per chunk
    const overlap = 60; // overlap words
    const chunks: Array<{ chunkIndex: number; pageNumber: number; content: string }> = [];

    if (words.length === 0) return chunks;

    let index = 0;
    let chunkCount = 0;
    const wordsPerPage = Math.max(1, Math.ceil(words.length / totalPages));

    while (index < words.length) {
      const chunkWords = words.slice(index, index + chunkSize);
      const content = chunkWords.join(' ');
      const middleWordIndex = index + Math.floor(chunkWords.length / 2);
      const pageNumber = Math.min(totalPages, Math.max(1, Math.floor(middleWordIndex / wordsPerPage) + 1));

      chunks.push({
        chunkIndex: chunkCount++,
        pageNumber,
        content,
      });

      index += chunkSize - overlap;
    }

    return chunks;
  }

  static async processDocument(docId: string, userId: string, buffer: Buffer) {
    const doc = DocumentsRepo.findById(docId);
    if (!doc) throw new Error('Document not found.');

    try {
      DocumentsRepo.updateById(docId, { status: 'processing', error: undefined });

      const { text, pageCount } = await this.extractText(buffer, doc.mimeType, doc.originalName);
      if (!text || text.trim().length === 0) {
        throw new Error('Extracted text is empty or could not be read from file.');
      }

      const chunks = this.chunkText(text, pageCount);

      // Clean existing chunks if retry
      DocumentChunksRepo.deleteMany(c => c.documentId === docId);

      // Generate embeddings and store chunks
      for (const ch of chunks) {
        const embedding = await AIService.generateEmbedding(ch.content);
        DocumentChunksRepo.insertOne({
          _id: `chunk_${docId}_${ch.chunkIndex}`,
          documentId: docId,
          userId,
          chunkIndex: ch.chunkIndex,
          pageNumber: ch.pageNumber,
          content: ch.content,
          embedding,
          createdAt: new Date().toISOString(),
        });
      }

      DocumentsRepo.updateById(docId, {
        status: 'ready',
        pageCount,
        chunkCount: chunks.length,
        extractedTextSample: text.substring(0, 3000),
      });

      return { success: true, pageCount, chunkCount: chunks.length };
    } catch (err: any) {
      DocumentsRepo.updateById(docId, {
        status: 'failed',
        error: err.message,
      });
      throw err;
    }
  }

  static cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    const mag = Math.sqrt(normA) * Math.sqrt(normB);
    return mag === 0 ? 0 : dot / mag;
  }

  static async retrieveRelevantChunks(
    userId: string,
    query: string,
    documentId?: string,
    topK = 4
  ): Promise<Array<IDocumentChunk & { similarity: number }>> {
    const queryEmbedding = await AIService.generateEmbedding(query);

    const candidates = DocumentChunksRepo.find(c => {
      if (c.userId !== userId) return false;
      if (documentId && c.documentId !== documentId) return false;
      return true;
    });

    if (candidates.length === 0) return [];

    const scored = candidates.map(chunk => {
      let sim = 0;
      if (chunk.embedding && chunk.embedding.length > 0) {
        sim = this.cosineSimilarity(queryEmbedding, chunk.embedding);
      } else {
        // Fallback keyword overlap score
        const queryTerms = query.toLowerCase().split(/\s+/);
        const text = chunk.content.toLowerCase();
        let matches = 0;
        for (const t of queryTerms) {
          if (t.length > 2 && text.includes(t)) matches++;
        }
        sim = matches / queryTerms.length;
      }
      return { ...chunk, similarity: sim };
    });

    scored.sort((a, b) => b.similarity - a.similarity);
    return scored.slice(0, topK);
  }

  static async askDocumentQuestion(
    userId: string,
    documentId: string,
    question: string
  ): Promise<{
    answer: string;
    citations: IDocumentCitation[];
  }> {
    const doc = DocumentsRepo.findById(documentId);
    if (!doc) throw new Error('Document not found.');
    if (doc.userId !== userId) throw new Error('Unauthorized document access.');

    const relevantChunks = await this.retrieveRelevantChunks(userId, question, documentId, 4);

    if (relevantChunks.length === 0) {
      return {
        answer: 'No processed text passages found for this document. Please ensure the document has finished processing with readable text.',
        citations: [],
      };
    }

    // Build citations list
    const citations: IDocumentCitation[] = relevantChunks.map(c => ({
      chunkId: c._id,
      pageNumber: c.pageNumber,
      snippet: c.content.length > 180 ? c.content.substring(0, 180) + '...' : c.content,
    }));

    // Build context
    const contextPassages = relevantChunks
      .map(c => `[PAGE ${c.pageNumber}]:\n${c.content}`)
      .join('\n\n---\n\n');

    const prompt = `You are an academic learning assistant answering a student's question grounded strictly in an uploaded textbook or course document.
Student Question: "${question}"

Below are retrieved excerpts from the student's document:
-------------------------
${contextPassages}
-------------------------

Instructions:
1. First, check if the retrieved document excerpts contain information directly answering the student's question.
2. Structure your response clearly:
   ### 📖 Document Findings
   Provide the direct answer backed by the text, citing specific page references like [Page X].
   
   ### 💡 Additional Academic Context (if needed)
   If the document provides partial context or if a real-world CS example/code helps clarify the concept, provide it here and clearly label it as general academic guidance.
3. If the retrieved document excerpts do NOT contain information answering the question, you MUST explicitly state:
   "The uploaded document does not contain explicit information regarding this question."
   Then you may provide general computer science knowledge, explicitly distinguishing it from document-backed facts.
4. Never fabricate citations or claim the document says something it does not contain.
5. Use clean formatting with standard textbook terminology.`;

    const answer = await AIService.generateTutorResponse([{ role: 'user', content: prompt }], 'beginner');

    return { answer, citations };
  }
}
