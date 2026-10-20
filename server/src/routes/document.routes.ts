import { Router } from 'express';
import multer from 'multer';
import { RAGService, validateExtractedText } from '../services/rag.service.js';
import { AIService } from '../services/ai.service.js';
import { authenticate, AuthenticatedRequest } from '../middleware/authMiddleware.js';
import {
  DocumentsRepo,
  DocumentChunksRepo,
  DocumentSummariesRepo,
  DocumentConversationsRepo,
  DocumentMessagesRepo,
  LearningActivitiesRepo,
} from '../models/repositories.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/markdown',
      'application/octet-stream',
    ];
    const ext = file.originalname.split('.').pop()?.toLowerCase();
    if (allowed.includes(file.mimetype) || ['pdf', 'docx', 'txt', 'md'].includes(ext || '')) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type. Please upload a PDF, DOCX, TXT, or Markdown document.'));
    }
  },
});

const router = Router();

// POST /api/documents/upload
router.post('/upload', authenticate, upload.single('file'), async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ success: false, error: 'Please select a document file to upload.' });
    }

    const { originalname, mimetype, size, buffer } = req.file;

    if (size < 32 || buffer.length < 32) {
      return res.status(400).json({
        success: false,
        error: 'The uploaded file is empty or too small (under 32 bytes). Please upload a valid document containing readable study text.',
      });
    }

    const newDoc = DocumentsRepo.insertOne({
      _id: 'doc_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      userId: req.user!._id,
      originalName: originalname,
      mimeType: mimetype,
      sizeBytes: size,
      pageCount: 1,
      chunkCount: 0,
      status: 'uploaded',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Process document
    try {
      await RAGService.processDocument(newDoc._id, req.user!._id, buffer);
    } catch (procErr: any) {
      // Document is updated to 'failed' inside processDocument
    }

    const finalDoc = DocumentsRepo.findById(newDoc._id)!;
    const isReady = finalDoc.status === 'ready';

    LearningActivitiesRepo.insertOne({
      _id: 'act_' + Date.now().toString(36),
      userId: req.user!._id,
      activityType: 'doc_upload',
      title: `Uploaded document: ${originalname}`,
      details: `${Math.round(size / 1024)} KB · Status: ${finalDoc.status}`,
      timestamp: new Date().toISOString(),
    });

    res.status(201).json({
      success: true,
      data: { document: finalDoc },
      message: isReady
        ? 'Document uploaded and indexed successfully!'
        : `Document uploaded, but text extraction failed: ${finalDoc.error || 'Unable to extract readable text'}.`,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/documents
router.get('/', authenticate, (req: AuthenticatedRequest, res, next) => {
  try {
    const docs = DocumentsRepo.find(d => d.userId === req.user!._id)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    res.json({ success: true, data: { documents: docs } });
  } catch (err) {
    next(err);
  }
});

// GET /api/documents/:id
router.get('/:id', authenticate, (req: AuthenticatedRequest, res, next) => {
  try {
    const doc = DocumentsRepo.findById(req.params.id);
    if (!doc || doc.userId !== req.user!._id) {
      return res.status(404).json({ success: false, error: 'Document not found.' });
    }
    res.json({ success: true, data: { document: doc } });
  } catch (err) {
    next(err);
  }
});

// GET /api/documents/:id/chunks
router.get('/:id/chunks', authenticate, (req: AuthenticatedRequest, res, next) => {
  try {
    const doc = DocumentsRepo.findById(req.params.id);
    if (!doc || doc.userId !== req.user!._id) {
      return res.status(404).json({ success: false, error: 'Document not found.' });
    }

    const chunks = DocumentChunksRepo.find(c => c.documentId === doc._id)
      .sort((a, b) => a.chunkIndex - b.chunkIndex)
      .map(c => ({
        _id: c._id,
        chunkIndex: c.chunkIndex,
        pageNumber: c.pageNumber,
        content: c.content,
      }));

    res.json({ success: true, data: { chunks } });
  } catch (err) {
    next(err);
  }
});

// POST /api/documents/:id/ask (Grounded RAG Q&A with citations)
router.post('/:id/ask', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { question } = req.body;
    if (!question || question.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Question cannot be empty.' });
    }

    const doc = DocumentsRepo.findById(req.params.id);
    if (!doc || doc.userId !== req.user!._id) {
      return res.status(404).json({ success: false, error: 'Document not found.' });
    }

    if (doc.status === 'failed') {
      return res.status(400).json({
        success: false,
        error: doc.error || 'Text extraction was not successful for this document. Please upload a searchable digital PDF or text file.',
      });
    }

    const result = await RAGService.askDocumentQuestion(req.user!._id, doc._id, question.trim());

    res.json({
      success: true,
      data: {
        question,
        answer: result.answer,
        citations: result.citations,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/documents/:id/summarize (Generate Detailed or Quick Summary)
router.post('/:id/summarize', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { summaryType = 'detailed' } = req.body; // 'detailed' | 'quick'
    const doc = DocumentsRepo.findById(req.params.id);
    if (!doc || doc.userId !== req.user!._id) {
      return res.status(404).json({ success: false, error: 'Document not found.' });
    }

    if (doc.status === 'failed') {
      return res.status(400).json({
        success: false,
        error: doc.error || 'Text extraction failed for this document. Please upload a readable digital PDF, DOCX, or text file.',
      });
    }

    const chunks = DocumentChunksRepo.find(c => c.documentId === doc._id)
      .sort((a, b) => a.chunkIndex - b.chunkIndex);

    const fullText = chunks.length > 0
      ? chunks.map(c => c.content).join('\n\n')
      : doc.extractedTextSample || '';

    const textValidation = validateExtractedText(fullText);
    if (!textValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: textValidation.reason || 'Document contains insufficient or unreadable text. Please upload a searchable digital PDF or text file.',
      });
    }

    const summaryResult = await AIService.generateDocumentSummary(
      textValidation.cleanedText,
      summaryType as any,
      {
        documentId: doc._id,
        documentName: doc.originalName,
        pageCount: doc.pageCount || Math.max(1, Math.ceil(textValidation.cleanedText.split(/\s+/).length / 450)),
        chunks: chunks.map(c => ({
          chunkIndex: c.chunkIndex,
          pageNumber: c.pageNumber,
          content: c.content,
        })),
      }
    );

    const savedSummary = DocumentSummariesRepo.insertOne({
      _id: 'sum_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      documentId: doc._id,
      userId: req.user!._id,
      documentName: doc.originalName,
      summaryType: summaryType as any,
      content: summaryResult.content,
      estimatedPages: summaryResult.estimatedPages,
      keyConcepts: summaryResult.keyConcepts,
      examPoints: summaryResult.examPoints,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({
      success: true,
      data: { summary: savedSummary },
      message: `${summaryType === 'detailed' ? 'Detailed Academic' : 'Quick Revision'} Summary generated successfully!`,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/documents/:id/summaries
router.get('/:id/summaries', authenticate, (req: AuthenticatedRequest, res, next) => {
  try {
    const doc = DocumentsRepo.findById(req.params.id);
    if (!doc || doc.userId !== req.user!._id) {
      return res.status(404).json({ success: false, error: 'Document not found.' });
    }

    const summaries = DocumentSummariesRepo.find(s => s.documentId === doc._id && s.userId === req.user!._id)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    res.json({ success: true, data: { summaries } });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/documents/:id
router.delete('/:id', authenticate, (req: AuthenticatedRequest, res, next) => {
  try {
    const doc = DocumentsRepo.findById(req.params.id);
    if (!doc || doc.userId !== req.user!._id) {
      return res.status(404).json({ success: false, error: 'Document not found.' });
    }

    DocumentsRepo.deleteById(doc._id);
    DocumentChunksRepo.deleteMany(c => c.documentId === doc._id);
    DocumentSummariesRepo.deleteMany(s => s.documentId === doc._id);

    res.json({ success: true, message: 'Document and processed chunks deleted.' });
  } catch (err) {
    next(err);
  }
});

export default router;
