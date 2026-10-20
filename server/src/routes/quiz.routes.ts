import { Router } from 'express';
import { AIService } from '../services/ai.service.js';
import { authenticate, AuthenticatedRequest } from '../middleware/authMiddleware.js';
import {
  QuizzesRepo,
  QuizAttemptsRepo,
  SubjectsRepo,
  TopicsRepo,
  DocumentsRepo,
  DocumentChunksRepo,
  ProgressRepo,
  LearningActivitiesRepo,
} from '../models/repositories.js';
import { IQuizAttemptAnswer } from '../models/types.js';

const router = Router();

// GET /api/quizzes
router.get('/', authenticate, (req: AuthenticatedRequest, res, next) => {
  try {
    const quizzes = QuizzesRepo.find(q => q.userId === req.user!._id)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

    const enriched = quizzes.map(q => {
      const attempts = QuizAttemptsRepo.find(a => a.quizId === q._id && a.userId === req.user!._id);
      const bestScore = attempts.length > 0 ? Math.max(...attempts.map(a => a.percentage)) : null;
      return {
        _id: q._id,
        title: q.title,
        subjectId: q.subjectId,
        topicId: q.topicId,
        difficulty: q.difficulty,
        questionCount: q.questionCount,
        timeLimitMinutes: q.timeLimitMinutes,
        attemptsCount: attempts.length,
        bestScore,
        createdAt: q.createdAt,
      };
    });

    res.json({ success: true, data: { quizzes: enriched } });
  } catch (err) {
    next(err);
  }
});

// GET /api/quizzes/:id (Safe question presentation - NO answer keys sent to frontend!)
router.get('/:id', authenticate, (req: AuthenticatedRequest, res, next) => {
  try {
    const quiz = QuizzesRepo.findById(req.params.id);
    if (!quiz || quiz.userId !== req.user!._id) {
      return res.status(404).json({ success: false, error: 'Quiz not found.' });
    }

    // Security rule: Never expose correctAnswer or explanation before submission!
    const safeQuestions = quiz.questions.map(q => ({
      id: q.id,
      question: q.question,
      type: q.type,
      options: q.options,
      topicTag: q.topicTag,
    }));

    res.json({
      success: true,
      data: {
        quiz: {
          _id: quiz._id,
          title: quiz.title,
          difficulty: quiz.difficulty,
          questionCount: quiz.questionCount,
          timeLimitMinutes: quiz.timeLimitMinutes,
          questions: safeQuestions,
        },
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/quizzes/generate (AI Quiz Generator)
router.post('/generate', authenticate, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { subjectId, topicId, documentId, difficulty = 'intermediate', questionCount = 5, timeLimitMinutes = 10 } = req.body;

    let quizContent = '';
    let quizTitle = 'Diagnostic Quiz';

    if (topicId) {
      const top = TopicsRepo.findById(topicId);
      if (top) {
        quizTitle = `${top.title} Quiz`;
        quizContent = `Topic: ${top.title}\nDefinition: ${top.definition}\nExplanation: ${top.detailedExplanation}\nKey Concepts: ${top.importantConcepts.join(', ')}\nExam Questions: ${top.examQuestions.map(e => e.question).join(', ')}`;
      }
    } else if (documentId) {
      const doc = DocumentsRepo.findById(documentId);
      if (doc && doc.userId === req.user!._id) {
        quizTitle = `${doc.originalName} Assessment`;
        const chunks = DocumentChunksRepo.find(c => c.documentId === doc._id)
          .sort((a, b) => a.chunkIndex - b.chunkIndex);
        if (chunks.length > 0) {
          quizContent = chunks.map(c => c.content).join('\n\n').substring(0, 10000);
        } else {
          quizContent = doc.extractedTextSample || '';
        }
      }
    } else if (subjectId) {
      const sub = SubjectsRepo.findById(subjectId);
      if (sub) {
        quizTitle = `${sub.name} Comprehensive Quiz`;
        const topics = TopicsRepo.find(t => t.subjectId === sub._id).slice(0, 4);
        quizContent = topics.map(t => `${t.title}: ${t.definition}`).join('\n\n');
      }
    }

    if (!quizContent || quizContent.trim().length === 0) {
      quizContent = 'Computer science core principles, algorithms, operating systems, and databases.';
    }

    // Call Gemini
    const questions = await AIService.generateQuiz(quizContent, Number(questionCount) || 5, difficulty);

    const newQuiz = QuizzesRepo.insertOne({
      _id: 'quiz_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      userId: req.user!._id,
      title: quizTitle,
      subjectId,
      topicId,
      sourceDocumentId: documentId,
      difficulty,
      questionCount: questions.length,
      timeLimitMinutes: Number(timeLimitMinutes) || 10,
      questions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    res.status(201).json({
      success: true,
      data: { quizId: newQuiz._id, title: newQuiz.title, questionCount: newQuiz.questionCount },
      message: 'Quiz generated successfully!',
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/quizzes/:id/submit (Server-Side Grading & Weak Topic Analysis)
router.post('/:id/submit', authenticate, (req: AuthenticatedRequest, res, next) => {
  try {
    const quiz = QuizzesRepo.findById(req.params.id);
    if (!quiz || quiz.userId !== req.user!._id) {
      return res.status(404).json({ success: false, error: 'Quiz not found.' });
    }

    const { studentAnswers = {}, timeSpentSeconds = 60 } = req.body; // { [qId]: studentChoice }
    let score = 0;
    const maxScore = quiz.questions.length;
    const gradedAnswers: IQuizAttemptAnswer[] = [];
    const weakTopics: string[] = [];

    for (const q of quiz.questions) {
      const studentAns = (studentAnswers[q.id] || '').trim();
      const isCorrect = studentAns.toLowerCase() === q.correctAnswer.trim().toLowerCase();

      if (isCorrect) {
        score++;
      } else {
        if (q.topicTag) weakTopics.push(q.topicTag);
      }

      gradedAnswers.push({
        questionId: q.id,
        question: q.question,
        studentAnswer: studentAns,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
        topicTag: q.topicTag,
      });
    }

    const percentage = Math.round((score / maxScore) * 100);
    const passed = percentage >= 70;

    const attempt = QuizAttemptsRepo.insertOne({
      _id: 'attempt_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      userId: req.user!._id,
      quizId: quiz._id,
      quizTitle: quiz.title,
      subjectId: quiz.subjectId,
      score,
      maxScore,
      percentage,
      passed,
      timeSpentSeconds: Number(timeSpentSeconds) || 60,
      answers: gradedAnswers,
      weakTopicsIdentified: Array.from(new Set(weakTopics)),
      attemptedAt: new Date().toISOString(),
    });

    // Update Progress
    if (quiz.subjectId) {
      const prog = ProgressRepo.findOne(p => p.userId === req.user!._id && p.subjectId === quiz.subjectId);
      if (prog) {
        const currentCount = prog.quizCount || 0;
        const currentAvg = prog.avgQuizScore || 0;
        const newAvg = Math.round((currentAvg * currentCount + percentage) / (currentCount + 1));
        ProgressRepo.updateById(prog._id, {
          quizCount: currentCount + 1,
          avgQuizScore: newAvg,
          lastStudiedAt: new Date().toISOString(),
        });
      }
    }

    // Record activity
    LearningActivitiesRepo.insertOne({
      _id: 'act_' + Date.now().toString(36),
      userId: req.user!._id,
      activityType: 'quiz_attempt',
      title: `Completed Quiz: ${quiz.title} (${percentage}%)`,
      details: `Scored ${score}/${maxScore} in ${Math.round(timeSpentSeconds / 60)} minutes. ${passed ? 'Passed' : 'Needs review'}.`,
      timestamp: new Date().toISOString(),
    });

    res.json({
      success: true,
      data: { attempt },
      message: `Quiz graded! You scored ${percentage}% (${score}/${maxScore}).`,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/quizzes/attempts/history
router.get('/attempts/history', authenticate, (req: AuthenticatedRequest, res, next) => {
  try {
    const attempts = QuizAttemptsRepo.find(a => a.userId === req.user!._id)
      .sort((a, b) => b.attemptedAt.localeCompare(a.attemptedAt));
    res.json({ success: true, data: { attempts } });
  } catch (err) {
    next(err);
  }
});

// GET /api/quizzes/attempts/:id
router.get('/attempts/:id', authenticate, (req: AuthenticatedRequest, res, next) => {
  try {
    const attempt = QuizAttemptsRepo.findById(req.params.id);
    if (!attempt || attempt.userId !== req.user!._id) {
      return res.status(404).json({ success: false, error: 'Attempt record not found.' });
    }
    res.json({ success: true, data: { attempt } });
  } catch (err) {
    next(err);
  }
});

export default router;
