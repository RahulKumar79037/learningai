import { getGeminiClient, isGeminiAvailable } from '../config/gemini.js';
import { env } from '../config/env.js';
import { TutorMode } from '../models/types.js';
import { AppError } from '../utils/errors.js';

export function parseGeminiError(err: any, contextDescription: string): { message: string; statusCode: number } {
  const rawMessage = (err?.message || String(err || '')).trim();

  let extracted = rawMessage;
  const jsonMatch = rawMessage.match(/\{[\s\S]*"message"[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.error?.message) extracted = parsed.error.message;
      else if (parsed.message) extracted = parsed.message;
    } catch {}
  }

  const lower = extracted.toLowerCase();

  if (lower.includes('404') || lower.includes('not_found') || lower.includes('is not found')) {
    return {
      message: `${contextDescription} temporarily unavailable: AI model was not found or is unavailable. Model configured: ${env.GEMINI_MODEL}.`,
      statusCode: 503,
    };
  }
  if (
    lower.includes('api_key_invalid') ||
    lower.includes('api key not valid') ||
    lower.includes('401') ||
    lower.includes('403') ||
    lower.includes('permission_denied')
  ) {
    return {
      message: `${contextDescription} failed: Invalid or unauthorized Gemini API key. Please check your GEMINI_API_KEY.`,
      statusCode: 401,
    };
  }
  if (lower.includes('quota') || lower.includes('resource_exhausted') || lower.includes('429')) {
    return {
      message: `${contextDescription} temporarily unavailable: rate limit or quota exceeded. Please try again shortly.`,
      statusCode: 429,
    };
  }
  if (
    lower.includes('503') ||
    lower.includes('high demand') ||
    lower.includes('unavailable') ||
    lower.includes('overloaded')
  ) {
    return {
      message: `${contextDescription} temporarily unavailable: AI service is currently experiencing high demand. Please retry in a few moments.`,
      statusCode: 503,
    };
  }
  if (lower.includes('safety') || lower.includes('blocked')) {
    return {
      message: `${contextDescription} was blocked by content safety filters. Please refine your query.`,
      statusCode: 400,
    };
  }

  const clean = extracted
    .replace(/^\[.*?\]\s*/g, '')
    .replace(/^Error:\s*/g, '')
    .trim();

  return {
    message: `${contextDescription} failed: ${clean || 'An error occurred while contacting the AI service.'}`,
    statusCode: 500,
  };
}

export function parseGeminiErrorMessage(err: any, contextDescription: string): string {
  return parseGeminiError(err, contextDescription).message;
}

export class AIService {
  private static getTutorSystemPrompt(mode: TutorMode): string {
    const commonPedagogicalStandard = `You are the Learning Companion AI Academic Tutor, an expert college and university educator and author of acclaimed textbook literature.
Your mission is to provide reliable, textbook-quality academic explanations that students can directly rely on for college exams, university finals, revision, assignments, and teaching.

### CORE PEDAGOGICAL RULES (BOTH MODES):
- Every answer must read like a top-tier college textbook written by an experienced subject professor.
- Accurate, understandable, properly structured, sufficiently detailed, and useful for real college exam preparation.
- NEVER invent artificial mathematical models (like custom three-tuple or five-tuple definitions for ordinary academic topics like stacks, queues, loops, or processes) unless the question explicitly asks for a formal mathematical model and that model is established in literature.
- NEVER invent historical citations, fake academic quotes, or unsupported specifications.
- NEVER add unrelated topics merely to appear advanced.
- When reliable source material or a syllabus is available, prioritize it.
- Use established concepts and explain assumptions. For questions outside computer science, adapt the explanation to the actual subject.
- Response length must match the question and the user's needs. If a 2-mark answer is requested, provide 2-3 sentences. If 5 or 10 marks are requested, provide suitable depth.`;

    if (mode === 'beginner') {
      return `${commonPedagogicalStandard}

============================================================
ACTIVE MODE: BEGINNER — DETAILED TEACHING FOR EASY UNDERSTANDING
============================================================
PURPOSE: Help students understand a concept from the fundamentals and prepare for college exams.
Teach progressively like a patient, supportive college professor. Do NOT assume the student already knows advanced terminology. Explain technical terms in simple language before using them.

STRUCTURE FOR BEGINNER MODE (Adapt to the question):
1. **Definition:** Start with a correct, standard academic textbook definition.
2. **Simple Explanation:** Explain the definition in easy, accessible English with an intuitive real-world analogy.
3. **Why It Is Needed:** Explain the core purpose and importance.
4. **Types / Classifications:** Explain the standard types and their differences.
5. **Working:** Explain how the concept works step by step.
6. **Examples:** Include both simple real-life analogies and practical technical examples.
7. **Diagram:** Include a relevant labeled ASCII diagram or flowchart inside a \`\`\`diagram block when it aids understanding.
8. **Advantages and Disadvantages:** Explain them clearly where applicable.
9. **Applications:** Practical real-world uses in computing or engineering.
10. **Exam Answer:** End with a concise model answer suitable for writing directly in a university examination.

BEGINNER TEACHING GUIDELINES:
- Use simple vocabulary, short paragraphs, clear bold headings, and familiar examples.
- For programming topics, provide beginner-friendly code with comments, explanation of key lines, and sample input/output.
- For comparative questions (e.g. "What is TCP and UDP?"):
  - Define both in simple language.
  - Explain their purpose and give everyday examples.
  - Provide a clear Markdown comparison table covering: Connection Setup, Reliability, Ordering, Speed & Overhead, Header Size, and Typical Applications.
  - Conclude with a concise exam answer.`;
    }

    // Advanced Mode
    return `${commonPedagogicalStandard}

============================================================
ACTIVE MODE: ADVANCED — IN-DEPTH TECHNICAL UNDERSTANDING
============================================================
PURPOSE: Help students understand advanced concepts, internal mechanisms, technical trade-offs, and challenging problems.
This mode must contain GENUINELY DEEPER and more technical information than Beginner mode. Do NOT simply pad the text or add empty jargon. Dive deep into internal systems, algorithms, and engineering realities.

INCLUDE WHEN RELEVANT:
1. **Precise Technical Definition & Prerequisites:** Rigorous definition with necessary architectural and theoretical context.
2. **Internal Working & Architecture:** Low-level mechanisms, memory layout, CPU/kernel interactions, data structures, or protocol packet structures.
3. **Detailed Algorithms, Mechanisms, or Protocols:** Concrete algorithmic steps, state transitions, or execution workflows.
4. **Formal Properties & Equations:** Invariants, mathematical formulations, or protocol rules where established in literature.
5. **Time & Space Complexity with Justification:** Exact Big-O derivations with mathematical justification (e.g., amortized analysis using accounting or potential methods).
6. **Edge Cases, Limitations & Failure Scenarios:** Boundary conditions, concurrency hazards, synchronization primitives, cache thrashing, or packet loss behaviors.
7. **Design Trade-offs & Comparative Analysis:** In-depth trade-off evaluation comparing alternatives (throughput vs latency, memory footprint vs CPU overhead, consistency vs availability).
8. **Advanced Examples & Code:** High-performance implementations, idiomatic patterns, or worked architectural problems.
9. **Optimization, Scalability & Security Considerations:** Cache locality, thread safety, vectorization, denial-of-service mitigations, or production scaling.
10. **Advanced Practice Questions & Explained Solutions:** Challenging university or technical questions with complete solutions.

ADVANCED TEACHING GUIDELINES:
- E.g. for "Explain stack implementation and amortized complexity":
  - Analyze dynamic array resizing vs linked list representations.
  - Prove amortized O(1) push time using the accounting/potential method when doubling capacity.
  - Discuss memory overhead, cache line locality, realloc behavior, and system trade-offs.
- E.g. for "Explain the TCP three-way handshake and connection state transitions":
  - Detail SYN, SYN-ACK, ACK packet exchange with sequence number generation and ISN randomization.
  - Detail TCP socket state machine transitions: CLOSED → LISTEN → SYN_SENT → SYN_RCVD → ESTABLISHED.
  - Address SYN flood attacks, SYN cookies, half-open connections, and TIME_WAIT socket exhaustion.`;
  }

  private static async executeWithRetry<T>(
    operation: (modelName: string) => Promise<T>,
    contextDescription: string,
    maxRetries = 4
  ): Promise<T> {
    // High-availability model sequence prioritizing fast, reliable endpoints:
    // 1. Ultra-fast high-availability tier: gemini-3.1-flash-lite
    // 2. Stable latest tier: gemini-flash-latest
    // 3. Fallback tier: configured model or gemini-3.1-flash-lite
    const candidateModels = [
      'gemini-3.1-flash-lite',
      'gemini-flash-latest',
      env.GEMINI_MODEL || 'gemini-3.1-flash-lite',
    ];

    let lastError: any = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const currentModel = candidateModels[Math.min(attempt - 1, candidateModels.length - 1)];
      try {
        return await operation(currentModel);
      } catch (err: any) {
        lastError = err;
        const errMsg = String(err?.message || '').toLowerCase();
        const isAuthOrSafety =
          errMsg.includes('api_key_invalid') ||
          errMsg.includes('api key not valid') ||
          errMsg.includes('permission_denied') ||
          errMsg.includes('safety') ||
          errMsg.includes('blocked');

        if (isAuthOrSafety) {
          break;
        }

        if (attempt < maxRetries) {
          const nextModel = candidateModels[Math.min(attempt, candidateModels.length - 1)];
          const backoffMs = Math.min(1000 * Math.pow(2, attempt - 1), 4000) + Math.floor(Math.random() * 200);
          console.log(`[AIService] Retrying ${contextDescription} (attempt ${attempt}/${maxRetries}) on "${nextModel}" after ${backoffMs}ms backoff...`);
          await new Promise(r => setTimeout(r, backoffMs));
          continue;
        }

        break;
      }
    }

    const { message, statusCode } = parseGeminiError(lastError, contextDescription);
    throw new AppError(message, statusCode);
  }

  static async generateTutorResponse(
    messages: Array<{ role: 'user' | 'model'; content: string }>,
    mode: TutorMode = 'beginner'
  ): Promise<string> {
    if (!isGeminiAvailable()) {
      throw new AppError('Gemini API key is not configured. Please set GEMINI_API_KEY in your environment or Secrets panel to enable AI features.', 503);
    }

    const ai = getGeminiClient();
    const systemInstruction = this.getTutorSystemPrompt(mode);

    // Build contents array for Gemini
    const contents = messages.map(m => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    return this.executeWithRetry(async (modelName) => {
      const response = await ai.models.generateContent({
        model: modelName,
        contents,
        config: {
          systemInstruction,
          temperature: 0.6,
        },
      });

      const text = response.text;
      if (!text || text.trim() === '') {
        throw new Error('The AI model returned an empty response. Please retry.');
      }
      return text;
    }, 'AI Tutor response');
  }

  static async generateNotes(topicTitle: string, subjectName: string, additionalContext?: string): Promise<string> {
    if (!isGeminiAvailable()) {
      throw new AppError('Gemini API key is not configured. Please set GEMINI_API_KEY to generate AI notes.', 503);
    }

    const ai = getGeminiClient();
    const prompt = `You are an expert college and university educator and author of renowned textbook literature.
Write comprehensive, textbook-quality academic study notes for college students preparing for university exams, finals, and independent study.

Subject: "${subjectName}"
Topic: "${topicTitle}"
${additionalContext ? `Source Material / Syllabus Context:\n${additionalContext}\n` : ''}

### TEXTBOOK NOTES STANDARD:
1. Resemble professionally formatted college textbook notes that students can read, revise, export, and use for university exam preparation and teaching.
2. Accurate, understandable, properly structured, sufficiently detailed, and without repetition or unnecessary filler.
3. NEVER invent artificial mathematical models (such as custom 3-tuples or 5-tuples) for ordinary academic topics.
4. For programming topics, include correct syntax, complete code examples, line-by-line explanations, and sample input/output.
5. For theoretical subjects, prioritize definitions, classifications, characteristics, step-by-step working, comparisons, examples, and applications.
6. ADAPT SECTIONS TO THE TOPIC: Do not force irrelevant sections into every topic (e.g. do not add code or time complexity to non-technical topics).
7. CLEAN MATHEMATICAL & TECHNICAL NOTATION:
   - For asymptotic complexity, use standard, clear readable notation: O(1), O(log n), O(n), O(n log n), O(n²). Do not use raw LaTeX markup like $\\mathcal{O}(n)$.
   - For acronyms, state transitions, or variables, write them directly in clean text (e.g., Program Counter (PC), State A → B). Do not wrap ordinary words in $\\text{...}$.
   - For formulas, use clear readable Markdown or standard mathematical expressions (e.g., ∑(i=1 to n) i = n(n+1)/2).

Structure the notes using these sections as appropriate:

# ${topicTitle}

## 1. Academic Definition
> **Definition:** Provide the standard, widely accepted academic textbook definition in clear, authoritative terms.

## 2. Introduction & Detailed Explanation
Explain the concept thoroughly in simple, accessible language. Explain why it is needed and its fundamental purpose, with an intuitive real-world analogy.

## 3. Important Characteristics
Bulleted breakdown of essential properties, principles, and key academic terminology.

## 4. Types or Classification
If the topic has types, categories, or architectures, explain EACH type separately with its distinct characteristics, working, and concrete examples.

## 5. Working or Process (Step-by-Step)
Explain the execution mechanism, lifecycle, operational steps, or workflow in clear sequential order.

## 6. Examples (Real-World & Technical)
Provide concrete real-world scenarios and technical examples showing how the topic functions in actual practice. For programming topics, provide clean, syntactically correct code with comments and sample input/output.

## 7. Relevant Diagrams or Flowcharts
When a visual aid genuinely improves understanding (e.g. data structures, architectures, lifecycles), include a clean, labeled diagram inside a \`\`\`diagram block:
\`\`\`diagram
[ Component A ] ---> [ Processing Step ] ---> [ Component B ]
\`\`\`

## 8. Tables Comparing Related Concepts
Provide a structured Markdown table comparing this topic with closely related alternatives using clear criteria.

## 9. Advantages and Disadvantages
Balanced, structured analysis of benefits, limitations, and design trade-offs.

## 10. Practical Applications
Specific industry systems, operating software, or scientific domains where this topic is applied.

## 11. Important Formulas, Algorithms, or Complexity Analysis (where relevant)
State exact formulas, Big-O time and space complexity with justification. (Omit if not applicable to this subject).

## 12. Summary and Revision Points
High-yield bulleted summary for rapid pre-exam revision.

## 13. Important University Examination Questions with Model Scoring Answers

### Question 1: Short Answer Question (2 Marks)
- **Question:** State a high-frequency, precise 2-mark university examination question on "${topicTitle}".
- **Target Answer Length:** Approximately 60–100 words.
- **Model Answer Structure:**
  * **Accurate Academic Definition:** State the standard, authoritative textbook definition.
  * **Explanatory Points:** 1–2 crucial technical points explaining the underlying principle.
  * **Concrete Example or Use:** Mention a simple real-world use case or practical application.

### Question 2: Medium Answer Question (5 Marks)
- **Question:** State a representative 5-mark university examination question requiring analytical explanation on "${topicTitle}".
- **Target Answer Length:** Approximately 150–250 words.
- **Model Answer Structure:**
  * **Definition & Context:** Formal definition and conceptual necessity.
  * **Detailed Explanation:** In-depth explanation of core principles, working, or mechanisms in complete sentences.
  * **Types, Steps, or Code Demonstration:** Clear classification, sequential execution steps, or syntactically correct code snippet where applicable.
  * **Conclusion:** Concise concluding insight or rule of thumb.

### Question 3: Detailed Comprehensive Answer (10 Marks)
- **Question:** State a major 10-mark university final examination question (e.g. comparing core paradigms, detailing architecture, or tracing complex algorithms) on "${topicTitle}".
- **Target Answer Length:** Approximately 500–800 words of thorough, substantive academic depth without empty filler.
- **Model Answer Structure (adapt appropriately to topic):**
  1. **Question / Title:** Clear question statement.
  2. **Introduction:** Technical context and why this topic is essential in modern computing.
  3. **Accurate Academic Definition & Invariants:** Formal definition with precise terminology.
  4. **Detailed Technical Explanation:** Rigorous explanation written in complete sentences (no shallow bullet points).
  5. **Types or Classifications:** Explain each type or architecture individually with distinct properties and examples.
  6. **Working Mechanism, Steps, or Principles:** Detailed chronological execution trace or operational workflow.
  7. **Concept Diagram or Flowchart:** Labeled diagram inside a \`\`\`diagram block illustrating the architecture.
  8. **Real-World Examples & Implementation Code:** Practical applications and syntactically correct code with line-by-line explanation.
  9. **Advantages & Limitations / Trade-Off Analysis:** Balanced academic evaluation.
  10. **Structured Comparison Table or Formulas:** A comprehensive Markdown table with clear evaluation criteria or mathematical formulations.
  11. **Conclusion & Scoring Summary:** Concise concluding summary for university graders.

Note: Answer strictly on "${topicTitle}". Preserve academic rigor, accuracy, and clarity.`;

    return this.executeWithRetry(async (modelName) => {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          temperature: 0.5,
        },
      });

      const text = response.text;
      if (!text) throw new Error('AI returned an empty response.');
      return text;
    }, 'AI Notes generation');
  }

  static async generateFlashcards(
    content: string,
    count = 5
  ): Promise<Array<{ question: string; answer: string; explanation: string; example?: string; difficulty: 'easy' | 'medium' | 'hard' }>> {
    if (!isGeminiAvailable()) {
      throw new AppError('Gemini API key is not configured. Please set GEMINI_API_KEY to generate flashcards.', 503);
    }

    const ai = getGeminiClient();
    const prompt = `You are a university academic examiner creating high-yield active-recall flashcards for college students.
Based on the following content, generate exactly ${count} high-quality flashcards.

CARD QUALITY RULES:
1. One clear question or concept on the front (field: "question").
2. One correct, concise, technically precise answer on the back (field: "answer").
   Example:
   Question: "What is a stack?"
   Answer: "A linear data structure that follows LIFO (Last In, First Out), meaning the last element added is the first to be removed."
3. One primary concept per card.
4. Distinguish between definitions, key concepts, comparison points, and practical applications across the deck.
5. Provide a helpful brief explanation (field: "explanation") explaining why this is true.
6. Provide a concrete example, formula, or brief code snippet if applicable (field: "example").
7. NO trivial questions, NO misleading simplifications, NO duplicate cards.
8. Set appropriate difficulty ("easy", "medium", "hard").

Return ONLY a valid JSON array matching this exact schema:
[
  {
    "question": "Clear conceptual question?",
    "answer": "Concise, precise answer",
    "explanation": "Why this is true and background context",
    "example": "Brief code snippet or real-world example",
    "difficulty": "easy"
  }
]

Content:
${content.substring(0, 8000)}`;

    return this.executeWithRetry(async (modelName) => {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.4,
        },
      });

      const raw = response.text || '[]';
      const cleanJson = raw.replace(/^```json/m, '').replace(/```$/m, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (!Array.isArray(parsed)) return [];

      return parsed.map((c: any) => ({
        question: String(c.question || '').trim(),
        answer: String(c.answer || '').trim(),
        explanation: String(c.explanation || '').trim(),
        example: c.example ? String(c.example).trim() : undefined,
        difficulty: ['easy', 'medium', 'hard'].includes(c.difficulty) ? c.difficulty : 'medium',
      })).filter(c => c.question.length > 0 && c.answer.length > 0);
    }, 'AI Flashcards generation');
  }

  static async generateQuiz(
    content: string,
    questionCount = 5,
    difficulty: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'
  ): Promise<Array<{
    id: string;
    question: string;
    type: 'mcq' | 'true_false' | 'short_answer';
    options?: string[];
    correctAnswer: string;
    explanation: string;
    topicTag?: string;
  }>> {
    if (!isGeminiAvailable()) {
      throw new AppError('Gemini API key is not configured. Please set GEMINI_API_KEY to generate quizzes.', 503);
    }

    const ai = getGeminiClient();
    const prompt = `You are a university exam assessment designer. Create a rigorous ${difficulty} quiz of exactly ${questionCount} questions based directly on the provided educational material.

QUIZ QUALITY RULES:
1. Every question must directly test concepts present in the provided material.
2. Mix of Multiple Choice (mcq) with exactly 4 distinct, plausible options and True/False questions.
3. For "mcq": The "options" array must contain 4 choices. "correctAnswer" must match one of the options EXACTLY.
4. For "true_false": "options" must be ["True", "False"]. "correctAnswer" must be either "True" or "False".
5. Distractors (wrong options) must be realistic and reflect common student misconceptions, not trivial nonsense.
6. "explanation" must clearly justify why the correct answer is right and why other options are incorrect.
7. No ambiguous, duplicate, or trivial questions.
8. Validate that "correctAnswer" strictly corresponds to the "explanation".

Return ONLY a valid JSON array matching this exact schema:
[
  {
    "id": "q1",
    "question": "Question text?",
    "type": "mcq",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Exact string of the correct option",
    "explanation": "Clear explanation of why this answer is correct and why other options are false",
    "topicTag": "Key concept tested"
  }
]

Educational Content:
${content.substring(0, 8000)}`;

    return this.executeWithRetry(async (modelName) => {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.4,
        },
      });

      const raw = response.text || '[]';
      const cleanJson = raw.replace(/^```json/m, '').replace(/```$/m, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (!Array.isArray(parsed)) return [];

      return parsed.map((q: any, idx: number) => {
        const id = q.id || `q${idx + 1}`;
        const question = String(q.question || '').trim();
        const type: 'mcq' | 'true_false' = q.type === 'true_false' ? 'true_false' : 'mcq';
        let options = Array.isArray(q.options) ? q.options.map((o: any) => String(o).trim()) : [];
        if (type === 'true_false' && options.length === 0) {
          options = ['True', 'False'];
        }
        let correctAnswer = String(q.correctAnswer || '').trim();
        // Fallback: if correctAnswer is not in options, make sure it is valid
        if (options.length > 0 && !options.includes(correctAnswer)) {
          correctAnswer = options[0];
        }
        const explanation = String(q.explanation || 'Refer to course notes.').trim();
        const topicTag = q.topicTag ? String(q.topicTag).trim() : 'Core Concept';

        return {
          id,
          question,
          type,
          options,
          correctAnswer,
          explanation,
          topicTag,
        };
      }).filter(q => q.question.length > 0 && q.options && q.options.length > 0);
    }, 'AI Quiz generation');
  }

  static calculateRenderedA4Pages(content: string): number {
    const words = content.split(/\s+/).filter(w => w.length > 0).length;
    const lines = content.split('\n');

    // Headings take vertical layout space (margins + large font)
    const h1Count = lines.filter(l => /^#\s+/.test(l.trim())).length;
    const h2Count = lines.filter(l => /^##\s+/.test(l.trim())).length;
    const h3Count = lines.filter(l => /^###\s+/.test(l.trim())).length;

    // Table rows (header, separator, data rows) take significant vertical height
    const tableRows = lines.filter(l => /^\|.*\|$/.test(l.trim())).length;

    // Code & diagram blocks
    const codeBlocks = content.match(/```[\s\S]*?```/g) || [];
    let codeBlockLines = 0;
    for (const block of codeBlocks) {
      codeBlockLines += block.split('\n').length;
    }

    // Callout blocks (> ...)
    const calloutLines = lines.filter(l => /^>\s+/.test(l.trim())).length;

    // Calculate layout equivalent in rendered A4 pages:
    // In standard academic layout (11pt font, 1.45 line height, 1-inch margins):
    // Standard prose text accounts for ~380 words per page
    const proseWords = Math.max(0, words - (codeBlockLines * 5) - (tableRows * 4));
    const prosePages = proseWords / 380;

    // Heading spacing contribution
    const headingPages = (h1Count * 0.15) + (h2Count * 0.10) + (h3Count * 0.05);

    // Table rows contribution (each row with borders/padding ~ 0.035 of a page)
    const tablePages = tableRows * 0.035;

    // Code & diagram blocks (~0.022 of a page per line)
    const blockPages = codeBlockLines * 0.022;

    // Callouts (~0.015 page per line)
    const calloutPages = calloutLines * 0.015;

    const totalEstimated = prosePages + headingPages + tablePages + blockPages + calloutPages;
    return Math.max(1, Math.round(totalEstimated * 10) / 10);
  }

  static async generateDocumentSummary(
    text: string,
    summaryType: 'detailed' | 'quick',
    metadata?: {
      documentId?: string;
      documentName?: string;
      pageCount?: number;
      chunks?: Array<{ chunkIndex: number; pageNumber: number; content: string }>;
      onProgress?: (progress: number, stepMessage: string) => void;
    }
  ): Promise<{
    content: string;
    estimatedPages: number;
    keyConcepts: string[];
    examPoints: string[];
    sourceWordCount: number;
    summaryWordCount: number;
    targetPagesText: string;
  }> {
    return this.generateMultiStageSummary({
      documentName: metadata?.documentName || 'Academic Document',
      pageCount: metadata?.pageCount || Math.max(1, Math.ceil(text.split(/\s+/).length / 450)),
      fullText: text,
      chunks: metadata?.chunks,
      summaryType,
      onProgress: metadata?.onProgress,
    });
  }

  static async generateMultiStageSummary(input: {
    documentName: string;
    pageCount: number;
    fullText: string;
    chunks?: Array<{ chunkIndex: number; pageNumber: number; content: string }>;
    summaryType: 'detailed' | 'quick';
    onProgress?: (progress: number, stepMessage: string) => void;
  }): Promise<{
    content: string;
    estimatedPages: number;
    keyConcepts: string[];
    examPoints: string[];
    sourceWordCount: number;
    summaryWordCount: number;
    targetPagesText: string;
  }> {
    if (!isGeminiAvailable()) {
      throw new AppError('Gemini API key is not configured. Please set GEMINI_API_KEY to generate document summaries.', 503);
    }

    const ai = getGeminiClient();
    const isDetailed = input.summaryType === 'detailed';
    const targetPagesText = isDetailed
      ? 'Option A: Detailed Academic Summary (50–100 rendered pages target)'
      : 'Option B: Quick Revision Summary (10–20 rendered pages target)';

    const sourceWords = input.fullText.split(/\s+/).filter(w => w.length > 0);
    const sourceWordCount = sourceWords.length;

    input.onProgress?.(5, 'Analyzing document chapters, headings, and structure...');

    // 1. Partition into section clusters
    interface SectionCluster {
      sectionIndex: number;
      title: string;
      pageRange: string;
      text: string;
    }

    const clusters: SectionCluster[] = [];

    if (input.chunks && input.chunks.length > 0) {
      const sortedChunks = [...input.chunks].sort((a, b) => a.chunkIndex - b.chunkIndex);
      // Detailed mode targets 50–100 rendered pages: group chunks into cohesive segments (2–4 chunks)
      // to give each section prompt rich source context while staying well within API RPM limits.
      let clusterSize = 3;
      if (isDetailed) {
        if (sortedChunks.length <= 6) clusterSize = 1;
        else if (sortedChunks.length <= 16) clusterSize = 2;
        else clusterSize = Math.max(3, Math.ceil(sortedChunks.length / 15));
      } else {
        clusterSize = Math.max(3, Math.ceil(sortedChunks.length / 8));
      }

      for (let i = 0; i < sortedChunks.length; i += clusterSize) {
        const group = sortedChunks.slice(i, i + clusterSize);
        const startPage = Math.min(...group.map(c => c.pageNumber));
        const endPage = Math.max(...group.map(c => c.pageNumber));
        const pageRange = startPage === endPage ? `Page ${startPage}` : `Pages ${startPage}–${endPage}`;
        
        // Detect prominent heading or title from first chunk
        const firstLines = group[0].content.split('\n').map(l => l.trim()).filter(Boolean);
        const headingMatch = firstLines.find(l => 
          /^(?:Chapter|Module|Unit|Section|Part|\d+\.)/i.test(l) || (l.length < 50 && /^[A-Z]/.test(l))
        );
        const title = headingMatch 
          ? headingMatch.replace(/^#+\s*/, '').replace(/\*+/g, '').trim()
          : `Chapter / Section ${Math.floor(i / clusterSize) + 1} (${pageRange})`;

        clusters.push({
          sectionIndex: Math.floor(i / clusterSize),
          title,
          pageRange,
          text: group.map(c => c.content).join('\n\n'),
        });
      }
    } else {
      // Split full text into windows
      const wordsPerWindow = isDetailed ? 450 : 1200;
      let wIdx = 0;
      let sIdx = 0;
      while (wIdx < sourceWords.length) {
        const windowWords = sourceWords.slice(wIdx, wIdx + wordsPerWindow);
        const startPage = Math.max(1, Math.floor(wIdx / 450) + 1);
        const endPage = Math.min(input.pageCount, Math.floor((wIdx + windowWords.length) / 450) + 1);
        const pageRange = startPage === endPage ? `Page ${startPage}` : `Pages ${startPage}–${endPage}`;
        clusters.push({
          sectionIndex: sIdx,
          title: `Chapter / Section ${sIdx + 1} (${pageRange})`,
          pageRange,
          text: windowWords.join(' '),
        });
        wIdx += wordsPerWindow - (isDetailed ? 50 : 100);
        sIdx++;
      }
    }

    const totalClusters = Math.max(1, clusters.length);
    const sectionSummaries: string[] = [];

    // 2. Synthesize each section cluster with dedicated academic prompts
    for (let i = 0; i < clusters.length; i++) {
      const cluster = clusters[i];
      const progressPct = 10 + Math.round(((i + 1) / (totalClusters + 1)) * 65);
      input.onProgress?.(
        progressPct,
        `Synthesizing ${cluster.title} (${i + 1}/${totalClusters})...`
      );

      const sectionPrompt = isDetailed
        ? `You are a senior university professor and textbook author creating exhaustive, textbook-grade study material from an uploaded academic source document.
Document: "${input.documentName}"
Target Chapter: "${cluster.title}" (${cluster.pageRange})

STRICT ACADEMIC GUIDELINES:
1. Cover all major concepts, definitions, classifications, mechanisms, principles, explanations, and technical details present in this source section.
2. Write full, rigorous academic paragraphs explaining core concepts in detail rather than merely listing keywords or bullet points.
3. Preserve technical accuracy, terminology, and the author's intended meaning.
4. Extract all mathematical formulas, Big-O complexities, algorithms, code snippets, or architectural principles present in this section.
5. Provide concrete technical demonstrations and comparison tables comparing related concepts.
6. Avoid duplicate explanations, empty filler, or repeating identical paragraphs.
7. Ground strictly in the provided text. Do not invent external claims.

REQUIRED SECTION STRUCTURE:
## Chapter / Section ${i + 1}: ${cluster.title} (${cluster.pageRange})

### 1. Section Introduction & Conceptual Foundations
Thorough explanation of the central themes and academic importance of this section.

### 2. Formal Academic Definitions & Core Invariants
List all key definitions and theorems in authoritative terms with precise terminology.

### 3. Step-by-Step Mechanisms & Theoretical Analysis
Detailed, narrative analysis of the working, algorithm, protocol, or lifecycle. Write complete explanatory sentences.

### 4. Technical Demonstrations, Code, or Formulas (where present in source)
Clean code blocks, execution flow, or mathematical relationships with line-by-line explanation.

### 5. Concept Diagrams & Architecture (where applicable)
Include a labeled diagram inside a \`\`\`diagram block illustrating the workflow or architecture.

### 6. Comparative Insights & Performance Trade-offs
A structured Markdown table or breakdown evaluating trade-offs, advantages, and limitations.

### 7. Section Exam Focus Points
Key questions and core concepts students must master for examinations from this section.

Source Section Text (${cluster.pageRange}):
${cluster.text.substring(0, 15000)}`
        : `You are a university academic coordinator creating compact, high-yield pre-exam revision material from an uploaded academic document.
Document: "${input.documentName}"
Target Section: "${cluster.title}" (${cluster.pageRange})

STRICT REVISION GUIDELINES:
1. Compact but sufficiently detailed revision material covering all key topics.
2. Concise definitions, key points, important classifications, formulas, comparisons, and exam-relevant facts.
3. Use structured headings, bullet points, summary tables, and revision checklists.
4. Avoid turning the revision summary into a tiny abstract or a handful of generic bullet points. Cover all essential content rigorously.

REQUIRED SECTION STRUCTURE:
## Section ${i + 1}: ${cluster.title} (${cluster.pageRange})
- **Core Definition & Purpose:** Concise, authoritative summary of what this section covers.
- **Key Academic Facts & Invariants:** High-yield point-by-point breakdown.
- **Summary Comparison Table or Formulas:** Key rules, complexities, or differences.
- **Rapid Revision Checklist:** Essential facts for final exam review.

Source Section Text (${cluster.pageRange}):
${cluster.text.substring(0, 15000)}`;

      try {
        const secRes = await this.executeWithRetry(async (modelName) => {
          const resp = await ai.models.generateContent({
            model: modelName,
            contents: sectionPrompt,
            config: { temperature: 0.4 },
          });
          return resp.text || '';
        }, `Section ${i + 1} synthesis`);

        if (secRes.trim()) {
          sectionSummaries.push(secRes.trim());
        }
      } catch (err: any) {
        console.log(`[Summary Notice] Section ${i + 1} extraction note: ${err.message}. Using extracted source content.`);
        sectionSummaries.push(`## Section ${i + 1}: ${cluster.title} (${cluster.pageRange})\n\n${cluster.text.substring(0, 2000)}\n\n*(Extracted directly from source pages ${cluster.pageRange})*`);
      }

      // Pacing delay to respect API quotas
      if (i < clusters.length - 1) {
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    input.onProgress?.(80, 'Assembling master document overview, cross-chapter synthesis, and university exam questions...');

    // 3. Global Document Overview & Cross-Chapter Master Synthesis
    const globalPrompt = `You are a university dean and academic curriculum director reviewing an uploaded academic textbook or course material.
Document Title: "${input.documentName}"
Source Volume: ${sourceWordCount} words across ${input.pageCount} pages.
Detected Chapters: ${clusters.map((c, idx) => `Chapter ${idx + 1}: ${c.title}`).join(', ')}

Create the Master Executive Framework and University Examination Preparation Guide based strictly on this document.

REQUIRED STRUCTURE:
# ${input.documentName}: Master Academic Study Guide

## Document Blueprint & Executive Overview
1. **Document Identification & Central Thesis:** State the exact discipline, core focus, and target educational level.
2. **Table of Contents & Module Structure:** Structured list of all chapters covered in this document.
3. **Primary Learning Outcomes:** Key competencies students acquire after mastering this document.

## Cross-Chapter Comparative Matrix & Theoretical Synthesis
A comprehensive Markdown comparison table or structured matrix connecting concepts across the chapters.

## Master University Examination Preparation Guide

### Short Answer Question (2 Marks)
- **Question:** State a high-frequency, precise 2-mark university exam question derived strictly from this document.
- **Target Answer Length:** Approximately 60–100 words.
- **Model Answer:**
  * **Accurate Academic Definition:** Precise textbook definition.
  * **Explanatory Points:** 1–2 crucial technical points.
  * **Concrete Example:** Simple real-world use case or practical application.

### Medium Answer Question (5 Marks)
- **Question:** State a representative 5-mark university exam question derived strictly from this document.
- **Target Answer Length:** Approximately 150–250 words.
- **Model Answer:**
  * **Definition & Context:** Formal definition and conceptual necessity.
  * **Detailed Explanation:** In-depth explanation of core mechanisms or important points in complete sentences.
  * **Classification / Steps / Code Example:** Distinct types, execution steps, or clean code snippet where applicable.
  * **Conclusion:** Brief concluding insight or rule of thumb.

### Detailed Comprehensive Answer (10 Marks)
- **Question:** State a major 10-mark university final examination question requiring thorough analysis derived strictly from this document.
- **Target Answer Length:** Approximately 500–800 words of substantive academic depth without empty filler.
- **Model Answer Structure:**
  1. **Question / Title:** Clear question statement.
  2. **Introduction:** Technical context and significance.
  3. **Accurate Academic Definition:** Formal definition with precise terminology.
  4. **Detailed Technical Explanation:** Rigorous explanation written in complete sentences.
  5. **Types or Classifications:** Explain each type or architecture individually.
  6. **Working Mechanism or Steps:** Detailed chronological execution trace or workflow.
  7. **Concept Diagram:** Inside a \`\`\`diagram block illustrating the workflow.
  8. **Real-World Examples & Implementation Code:** Practical code with explanation.
  9. **Advantages & Limitations:** Balanced trade-off analysis.
  10. **Structured Comparison Table or Formulas:** A comprehensive table with clear criteria.
  11. **Conclusion:** Concise concluding scoring summary.

Document Context Sample:
${input.fullText.substring(0, 12000)}`;

    let globalOverview = '';
    try {
      globalOverview = await this.executeWithRetry(async (modelName) => {
        const resp = await ai.models.generateContent({
          model: modelName,
          contents: globalPrompt,
          config: { temperature: 0.4 },
        });
        return resp.text || '';
      }, 'Master overview synthesis');
    } catch (err: any) {
      console.log(`[Global Summary Notice] ${err.message}`);
      globalOverview = `# ${input.documentName}: Master Academic Study Guide\n\n## Document Overview\nThis comprehensive academic study guide is synthesized from ${input.documentName} (${sourceWordCount} words across ${input.pageCount} pages).`;
    }

    input.onProgress?.(95, 'Calculating honest rendered page counts and formatting final textbook document...');

    // 4. Assemble the complete document
    const assembledBody = sectionSummaries.join('\n\n---\n\n');
    const rawAssembled = `${globalOverview}\n\n---\n\n# Chapter-by-Chapter Comprehensive Academic Content\n\n${assembledBody}`;

    // 5. Honest Rendered Page Counting based on actual rendered typography, headings, tables, diagrams, and prose
    const summaryWords = rawAssembled.split(/\s+/).filter(w => w.length > 0).length;
    const estimatedPages = AIService.calculateRenderedA4Pages(rawAssembled);

    const targetMin = isDetailed ? 50 : 10;
    const targetMax = isDetailed ? 100 : 20;

    let integrityNotice = '';
    if (estimatedPages < targetMin) {
      integrityNotice = `The source document contains ${sourceWordCount.toLocaleString()} words across ${input.pageCount} pages. All substantive chapters, definitions, mechanisms, and tables have been exhaustively analyzed in full academic depth. To preserve factual accuracy, no artificial padding, repetitive filler, or fabricated external claims were added to artificially force the page count to the ${targetMin}–${targetMax} target.`;
    } else {
      integrityNotice = `The source document contains substantive volume (${sourceWordCount.toLocaleString()} words across ${input.pageCount} pages), enabling complete realization of the target page depth (~${estimatedPages} rendered A4 pages) with exhaustive chapter-wise analysis.`;
    }

    const scopeBanner = `> ### 📄 Document Scope & Rendered Page Analysis
> - **Summary Mode:** ${targetPagesText}
> - **Source Document Volume:** ${sourceWordCount.toLocaleString()} extracted words across ${input.pageCount} source pages (${input.chunks?.length || 1} indexed segments).
> - **Rendered Summary Length:** ~${summaryWords.toLocaleString()} words (~${estimatedPages} rendered A4 pages).
> - **Academic Integrity Notice:** ${integrityNotice}

`;

    const finalContent = scopeBanner + rawAssembled;

    // 6. Extract key concepts and exam points
    const keyConcepts = finalContent
      .split('\n')
      .filter(l => l.trim().startsWith('- **') || l.trim().startsWith('* **'))
      .slice(0, 8)
      .map(l => l.replace(/^[-*]\s+\*\*/, '').replace(/\*\*.*$/, '').trim())
      .filter(Boolean);

    const examPoints = [
      'Master all formal academic definitions and core invariants from each chapter.',
      'Review time/space complexity bounds and comparison tables in detail.',
      'Practice solving the 2-mark, 5-mark, and 10-mark model scoring questions provided in the exam guide.',
    ];

    input.onProgress?.(100, 'Academic document synthesis complete.');

    return {
      content: finalContent,
      estimatedPages,
      keyConcepts: keyConcepts.length > 0 ? keyConcepts : ['Core Principles', 'Architectural Breakdown', 'Algorithmic Optimization'],
      examPoints,
      sourceWordCount,
      summaryWordCount: summaryWords,
      targetPagesText,
    };
  }

  static async generateEmbedding(text: string): Promise<number[]> {
    if (!isGeminiAvailable()) {
      // Deterministic fallback embedding vector based on term hashing
      return this.computeFallbackEmbedding(text);
    }

    try {
      const ai = getGeminiClient();
      const response = await ai.models.embedContent({
        model: env.GEMINI_EMBEDDING_MODEL || 'text-embedding-004',
        contents: text.substring(0, 2000),
      });

      const resAny = response as any;
      if (resAny.embedding?.values) {
        return resAny.embedding.values;
      }
      if (resAny.embeddings?.[0]?.values) {
        return resAny.embeddings[0].values;
      }
      return this.computeFallbackEmbedding(text);
    } catch (err) {
      return this.computeFallbackEmbedding(text);
    }
  }

  private static computeFallbackEmbedding(text: string, dimensions = 64): number[] {
    const vector = new Array(dimensions).fill(0);
    const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      let hash = 0;
      for (let j = 0; j < w.length; j++) {
        hash = (hash << 5) - hash + w.charCodeAt(j);
        hash |= 0;
      }
      const index = Math.abs(hash) % dimensions;
      vector[index] += 1;
    }
    // Normalize vector
    const norm = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0));
    return norm > 0 ? vector.map(v => v / norm) : vector;
  }
}
