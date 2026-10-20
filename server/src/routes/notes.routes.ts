import { Router } from 'express';
import { AIService } from '../services/ai.service.js';
import { authenticate, AuthenticatedRequest } from '../middleware/authMiddleware.js';
import { NotesRepo, SubjectsRepo, TopicsRepo, DocumentsRepo, DocumentChunksRepo, LearningActivitiesRepo } from '../models/repositories.js';

const router = Router();

// GET /api/notes
router.get('/', authenticate, (req: AuthenticatedRequest, res, next) => {
  try {
    const { subjectId, search } = req.query;
    let notes = NotesRepo.find(n => n.userId === req.user!._id);

    if (subjectId) {
      notes = notes.filter(n => n.subjectId === subjectId);
    }

    if (search && typeof search === 'string' && search.trim().length > 0) {
      const q = search.toLowerCase().trim();
      notes = notes.filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || n.tags.some(t => t.toLowerCase().includes(q)));
    }

    notes.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    res.json({ success: true, data: { notes } });
  } catch (err) {
    next(err);
  }
});

// GET /api/notes/:id
router.get('/:id', authenticate, (req: AuthenticatedRequest, res, next) => {
  try {
    const note = NotesRepo.findById(req.params.id);
    if (!note || note.userId !== req.user!._id) {
      return res.status(404).json({ success: false, error: 'Note not found.' });
    }
    res.json({ success: true, data: { note } });
  } catch (err) {
    next(err);
  }
});

// POST /api/notes
router.post('/', authenticate, (req: AuthenticatedRequest, res, next) => {
  try {
    const { title, content, subjectId, topicId, tags = [] } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, error: 'Title and content are required.' });
    }

    const newNote = NotesRepo.insertOne({
      _id: 'note_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      userId: req.user!._id,
      title: title.trim(),
      content: content.trim(),
      subjectId,
      topicId,
      tags: Array.isArray(tags) ? tags : [],
      isAiGenerated: false,
      sourceType: 'manual',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    LearningActivitiesRepo.insertOne({
      _id: 'act_' + Date.now().toString(36),
      userId: req.user!._id,
      activityType: 'note_created',
      title: `Created study note: ${newNote.title}`,
      timestamp: new Date().toISOString(),
    });

    res.status(201).json({ success: true, data: { note: newNote } });
  } catch (err) {
    next(err);
  }
});

// POST /api/notes/generate (AI Note Generation)
router.post('/generate', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { topicTitle, subjectId, topicId, documentId, customTopic } = req.body;

    let targetTopic = topicTitle || customTopic || 'Computer Science Concepts';
    let subjectName = 'General Computer Science';
    let additionalContext = '';

    if (subjectId) {
      const sub = SubjectsRepo.findById(subjectId);
      if (sub) subjectName = sub.name;
    }

    if (topicId) {
      const top = TopicsRepo.findById(topicId);
      if (top) {
        targetTopic = top.title;
        additionalContext = `Summary: ${top.summary}\nKey Concepts: ${top.importantConcepts.join(', ')}`;
      }
    }

    if (documentId) {
      const doc = DocumentsRepo.findById(documentId);
      if (doc && doc.userId === req.user!._id) {
        const chunks = DocumentChunksRepo.find(c => c.documentId === doc._id)
          .sort((a, b) => a.chunkIndex - b.chunkIndex);
        const docText = chunks.length > 0
          ? chunks.map(c => c.content).join('\n\n').substring(0, 10000)
          : doc.extractedTextSample || '';
        additionalContext += `\nDocument Source (${doc.originalName}):\n${docText}`;
      }
    }

    // Generate with Gemini
    const generatedContent = await AIService.generateNotes(targetTopic, subjectName, additionalContext);

    const newNote = NotesRepo.insertOne({
      _id: 'note_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      userId: req.user!._id,
      title: `${targetTopic} (AI Notes)`,
      content: generatedContent,
      subjectId,
      topicId,
      sourceDocumentId: documentId,
      tags: [subjectName, 'AI-Generated', 'Revision'],
      isAiGenerated: true,
      sourceType: documentId ? 'document' : topicId ? 'subject_module' : 'custom_topic',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    LearningActivitiesRepo.insertOne({
      _id: 'act_' + Date.now().toString(36),
      userId: req.user!._id,
      activityType: 'note_created',
      title: `Generated AI Study Notes: ${targetTopic}`,
      details: `Comprehensive revision notes generated for ${subjectName}`,
      timestamp: new Date().toISOString(),
    });

    res.status(201).json({ success: true, data: { note: newNote }, message: 'Study notes generated successfully.' });
  } catch (err) {
    next(err);
  }
});

// PUT /api/notes/:id
router.put('/:id', authenticate, (req: AuthenticatedRequest, res, next) => {
  try {
    const note = NotesRepo.findById(req.params.id);
    if (!note || note.userId !== req.user!._id) {
      return res.status(404).json({ success: false, error: 'Note not found.' });
    }

    const { title, content, tags, subjectId } = req.body;
    const updated = NotesRepo.updateById(note._id, {
      ...(title && { title: title.trim() }),
      ...(content && { content: content.trim() }),
      ...(tags && { tags }),
      ...(subjectId !== undefined && { subjectId }),
      updatedAt: new Date().toISOString(),
    });

    res.json({ success: true, data: { note: updated } });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/notes/:id
router.delete('/:id', authenticate, (req: AuthenticatedRequest, res, next) => {
  try {
    const note = NotesRepo.findById(req.params.id);
    if (!note || note.userId !== req.user!._id) {
      return res.status(404).json({ success: false, error: 'Note not found.' });
    }

    NotesRepo.deleteById(note._id);
    res.json({ success: true, message: 'Note deleted.' });
  } catch (err) {
    next(err);
  }
});

export default router;
