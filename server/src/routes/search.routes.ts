import { Router } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/authMiddleware.js';
import {
  SubjectsRepo,
  TopicsRepo,
  NotesRepo,
  FlashcardDecksRepo,
  QuizzesRepo,
  DocumentsRepo,
  StudyTasksRepo,
} from '../models/repositories.js';

const router = Router();

// GET /api/search?q=query
router.get('/', authenticate, (req: AuthenticatedRequest, res, next) => {
  try {
    const query = typeof req.query.q === 'string' ? req.query.q.toLowerCase().trim() : '';
    if (!query || query.length < 2) {
      return res.json({
        success: true,
        data: {
          results: {
            subjects: [],
            topics: [],
            notes: [],
            decks: [],
            quizzes: [],
            documents: [],
            tasks: [],
          },
          totalCount: 0,
        },
      });
    }

    const userId = req.user!._id;

    // 1. Subjects
    const subjects = SubjectsRepo.find(s => s.name.toLowerCase().includes(query) || s.description.toLowerCase().includes(query))
      .map(s => ({
        id: s._id,
        title: s.name,
        snippet: s.description,
        url: `/curriculum/${s.slug}`,
        category: 'Subject',
      }));

    // 2. Topics / Modules
    const topics = TopicsRepo.find(t => t.title.toLowerCase().includes(query) || t.summary.toLowerCase().includes(query) || t.definition.toLowerCase().includes(query))
      .slice(0, 8)
      .map(t => ({
        id: t._id,
        title: t.title,
        snippet: t.summary,
        url: `/curriculum/${t.subjectSlug}/${t.slug}`,
        category: 'Module',
      }));

    // 3. User Notes
    const notes = NotesRepo.find(n => n.userId === userId && (n.title.toLowerCase().includes(query) || n.content.toLowerCase().includes(query)))
      .slice(0, 5)
      .map(n => ({
        id: n._id,
        title: n.title,
        snippet: n.content.substring(0, 120) + '...',
        url: `/notes/${n._id}`,
        category: 'Note',
      }));

    // 4. Flashcard Decks
    const decks = FlashcardDecksRepo.find(d => d.userId === userId && (d.title.toLowerCase().includes(query) || d.description.toLowerCase().includes(query)))
      .slice(0, 5)
      .map(d => ({
        id: d._id,
        title: d.title,
        snippet: d.description || `${d.cardCount} flashcards`,
        url: `/flashcards/${d._id}`,
        category: 'Flashcard Deck',
      }));

    // 5. Quizzes
    const quizzes = QuizzesRepo.find(q => q.userId === userId && q.title.toLowerCase().includes(query))
      .slice(0, 5)
      .map(q => ({
        id: q._id,
        title: q.title,
        snippet: `${q.difficulty} difficulty · ${q.questionCount} questions`,
        url: `/quiz/${q._id}`,
        category: 'Quiz',
      }));

    // 6. Documents
    const documents = DocumentsRepo.find(d => d.userId === userId && d.originalName.toLowerCase().includes(query))
      .slice(0, 5)
      .map(d => ({
        id: d._id,
        title: d.originalName,
        snippet: `${d.pageCount} pages · ${d.chunkCount} chunks indexed`,
        url: `/documents/${d._id}`,
        category: 'Document',
      }));

    // 7. Tasks
    const tasks = StudyTasksRepo.find(t => t.userId === userId && t.title.toLowerCase().includes(query))
      .slice(0, 5)
      .map(t => ({
        id: t._id,
        title: t.title,
        snippet: `Priority: ${t.priority} · ${t.completed ? 'Completed' : 'Pending'}`,
        url: '/planner',
        category: 'Study Task',
      }));

    const totalCount = subjects.length + topics.length + notes.length + decks.length + quizzes.length + documents.length + tasks.length;

    res.json({
      success: true,
      data: {
        results: {
          subjects,
          topics,
          notes,
          decks,
          quizzes,
          documents,
          tasks,
        },
        totalCount,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
