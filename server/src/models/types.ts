export type UserRole = 'student' | 'admin';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
  avatar?: string;
  dailyStudyGoalMinutes: number;
  studyStreak: number;
  lastActiveDate?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISubject {
  _id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  order: number;
  moduleCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ITopic {
  _id: string;
  subjectId: string;
  subjectSlug: string;
  title: string;
  slug: string;
  order: number;
  estimatedMinutes: number;
  summary: string;
  definition: string;
  detailedExplanation: string;
  typesAndClassifications: string[];
  importantConcepts: string[];
  practicalApplications: string[];
  codeExamples?: Array<{ language: string; title: string; code: string; explanation: string }>;
  complexityAnalysis?: { timeComplexity?: string; spaceComplexity?: string; explanation?: string };
  commonMistakes: string[];
  interviewQuestions: Array<{ question: string; answer: string; tips?: string }>;
  examQuestions: Array<{ question: string; marks: number; solutionGuide: string }>;
  practiceExercises: string[];
  revisionNotes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IStudyPlan {
  _id: string;
  userId: string;
  title: string;
  startDate: string;
  endDate: string;
  dailyTargetMinutes: number;
  weeklyTargetHours: number;
  selectedSubjects: string[];
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface IStudyTask {
  _id: string;
  userId: string;
  planId?: string;
  subjectId?: string;
  topicId?: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  estimatedMinutes: number;
  deadline?: string;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IStudySession {
  _id: string;
  userId: string;
  subjectId?: string;
  topicId?: string;
  durationMinutes: number;
  sessionType: 'tutor' | 'notes' | 'flashcards' | 'quiz' | 'reading' | 'focus_timer';
  notes?: string;
  completedAt: string;
  createdAt: string;
}

export interface IProgress {
  _id: string;
  userId: string;
  subjectId: string;
  completedTopicIds: string[];
  totalStudyMinutes: number;
  quizCount: number;
  avgQuizScore: number;
  flashcardsReviewed: number;
  lastStudiedAt: string;
  updatedAt: string;
}

export interface ILearningActivity {
  _id: string;
  userId: string;
  activityType: 'topic_study' | 'quiz_attempt' | 'flashcard_review' | 'note_created' | 'doc_upload' | 'ai_chat';
  title: string;
  details?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export type TutorMode = 'beginner' | 'advanced';

export interface IAIMessage {
  _id: string;
  conversationId: string;
  userId: string;
  role: 'user' | 'model';
  content: string;
  createdAt: string;
}

export interface IAIConversation {
  _id: string;
  userId: string;
  title: string;
  mode: TutorMode;
  subjectId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface INote {
  _id: string;
  userId: string;
  subjectId?: string;
  topicId?: string;
  title: string;
  content: string;
  tags: string[];
  isAiGenerated: boolean;
  sourceType: 'manual' | 'subject_module' | 'custom_topic' | 'document';
  sourceDocumentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IFlashcardDeck {
  _id: string;
  userId: string;
  title: string;
  description: string;
  subjectId?: string;
  topicId?: string;
  sourceDocumentId?: string;
  cardCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IFlashcard {
  _id: string;
  deckId: string;
  userId: string;
  question: string;
  answer: string;
  explanation: string;
  example?: string;
  subjectId?: string;
  topicId?: string;
  sourceReference?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  box: number; // 0 to 5 (Leitner box)
  reviewCount: number;
  lastReviewedAt?: string;
  nextReviewDate: string;
  learned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IFlashcardReview {
  _id: string;
  userId: string;
  deckId: string;
  flashcardId: string;
  rating: 'again' | 'hard' | 'good' | 'easy';
  reviewedAt: string;
}

export type QuestionType = 'mcq' | 'true_false' | 'short_answer';

export interface IQuizQuestion {
  id: string;
  question: string;
  type: QuestionType;
  options?: string[]; // for mcq
  correctAnswer: string; // evaluated server-side only
  explanation: string;
  topicTag?: string;
}

export interface IQuiz {
  _id: string;
  userId: string;
  title: string;
  subjectId?: string;
  topicId?: string;
  sourceDocumentId?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  questionCount: number;
  timeLimitMinutes?: number;
  questions: IQuizQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface IQuizAttemptAnswer {
  questionId: string;
  question: string;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
  topicTag?: string;
}

export interface IQuizAttempt {
  _id: string;
  userId: string;
  quizId: string;
  quizTitle: string;
  subjectId?: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  timeSpentSeconds: number;
  answers: IQuizAttemptAnswer[];
  weakTopicsIdentified: string[];
  attemptedAt: string;
}

export interface IDocument {
  _id: string;
  userId: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  pageCount: number;
  chunkCount: number;
  status: 'uploaded' | 'processing' | 'ready' | 'failed';
  extractedTextSample?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IDocumentChunk {
  _id: string;
  documentId: string;
  userId: string;
  chunkIndex: number;
  pageNumber: number;
  content: string;
  embedding?: number[];
  createdAt: string;
}

export interface IDocumentConversation {
  _id: string;
  documentId: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface IDocumentCitation {
  chunkId: string;
  pageNumber: number;
  snippet: string;
}

export interface IDocumentMessage {
  _id: string;
  conversationId: string;
  documentId: string;
  userId: string;
  role: 'user' | 'model';
  content: string;
  citations: IDocumentCitation[];
  createdAt: string;
}

export interface IDocumentSummary {
  _id: string;
  documentId: string;
  userId: string;
  documentName: string;
  summaryType: 'detailed' | 'quick';
  content: string;
  estimatedPages: number;
  keyConcepts: string[];
  examPoints: string[];
  sourceWordCount?: number;
  summaryWordCount?: number;
  targetPagesText?: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'failed';
  progress?: number;
  currentStep?: string;
  createdAt: string;
}

export interface IRecommendation {
  _id: string;
  userId: string;
  subjectId?: string;
  topicTitle: string;
  reason: string;
  priority: 'low' | 'medium' | 'high';
  actionType: 'study_topic' | 'retake_quiz' | 'review_flashcards';
  actionUrl: string;
  isDismissed: boolean;
  createdAt: string;
}

export interface IAuditLog {
  _id: string;
  userId?: string;
  userEmail?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  timestamp: string;
}
