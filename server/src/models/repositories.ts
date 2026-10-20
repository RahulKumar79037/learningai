import { localStore } from '../config/db.js';
import {
  IUser,
  ISubject,
  ITopic,
  IStudyPlan,
  IStudyTask,
  IStudySession,
  IProgress,
  ILearningActivity,
  IAIConversation,
  IAIMessage,
  INote,
  IFlashcardDeck,
  IFlashcard,
  IFlashcardReview,
  IQuiz,
  IQuizAttempt,
  IDocument,
  IDocumentChunk,
  IDocumentConversation,
  IDocumentMessage,
  IDocumentSummary,
  IRecommendation,
  IAuditLog,
} from './types.js';

export const UsersRepo = localStore.getCollection<IUser>('users');
export const SubjectsRepo = localStore.getCollection<ISubject>('subjects');
export const TopicsRepo = localStore.getCollection<ITopic>('topics');
export const StudyPlansRepo = localStore.getCollection<IStudyPlan>('studyPlans');
export const StudyTasksRepo = localStore.getCollection<IStudyTask>('studyTasks');
export const StudySessionsRepo = localStore.getCollection<IStudySession>('studySessions');
export const ProgressRepo = localStore.getCollection<IProgress>('progress');
export const LearningActivitiesRepo = localStore.getCollection<ILearningActivity>('activities');
export const AIConversationsRepo = localStore.getCollection<IAIConversation>('aiConversations');
export const AIMessagesRepo = localStore.getCollection<IAIMessage>('aiMessages');
export const NotesRepo = localStore.getCollection<INote>('notes');
export const FlashcardDecksRepo = localStore.getCollection<IFlashcardDeck>('flashcardDecks');
export const FlashcardsRepo = localStore.getCollection<IFlashcard>('flashcards');
export const FlashcardReviewsRepo = localStore.getCollection<IFlashcardReview>('flashcardReviews');
export const QuizzesRepo = localStore.getCollection<IQuiz>('quizzes');
export const QuizAttemptsRepo = localStore.getCollection<IQuizAttempt>('quizAttempts');
export const DocumentsRepo = localStore.getCollection<IDocument>('documents');
export const DocumentChunksRepo = localStore.getCollection<IDocumentChunk>('documentChunks');
export const DocumentConversationsRepo = localStore.getCollection<IDocumentConversation>('documentConversations');
export const DocumentMessagesRepo = localStore.getCollection<IDocumentMessage>('documentMessages');
export const DocumentSummariesRepo = localStore.getCollection<IDocumentSummary>('documentSummaries');
export const RecommendationsRepo = localStore.getCollection<IRecommendation>('recommendations');
export const AuditLogsRepo = localStore.getCollection<IAuditLog>('auditLogs');
