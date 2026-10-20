import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  _id: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  isActive: { type: Boolean, default: true },
  avatar: { type: String },
  dailyStudyGoalMinutes: { type: Number, default: 60 },
  studyStreak: { type: Number, default: 0 },
  lastActiveDate: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: String },
}, { timestamps: true });

const SubjectSchema = new Schema({
  _id: { type: String },
  slug: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, default: 'Computer Science' },
  icon: { type: String, default: 'BookOpen' },
  order: { type: Number, default: 0 },
  moduleCount: { type: Number, default: 0 },
}, { timestamps: true });

const TopicSchema = new Schema({
  _id: { type: String },
  subjectId: { type: String, required: true, index: true },
  subjectSlug: { type: String, required: true, index: true },
  title: { type: String, required: true },
  slug: { type: String, required: true },
  order: { type: Number, default: 0 },
  estimatedMinutes: { type: Number, default: 30 },
  summary: { type: String, required: true },
  definition: { type: String, required: true },
  detailedExplanation: { type: String, required: true },
  typesAndClassifications: [{ type: String }],
  importantConcepts: [{ type: String }],
  practicalApplications: [{ type: String }],
  codeExamples: [{ language: String, title: String, code: String, explanation: String }],
  complexityAnalysis: { timeComplexity: String, spaceComplexity: String, explanation: String },
  commonMistakes: [{ type: String }],
  interviewQuestions: [{ question: String, answer: String, tips: String }],
  examQuestions: [{ question: String, marks: Number, solutionGuide: String }],
  practiceExercises: [{ type: String }],
  revisionNotes: [{ type: String }],
}, { timestamps: true });

const DocumentSchema = new Schema({
  _id: { type: String },
  userId: { type: String, required: true, index: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  sizeBytes: { type: Number, required: true },
  pageCount: { type: Number, default: 1 },
  chunkCount: { type: Number, default: 0 },
  status: { type: String, enum: ['uploaded', 'processing', 'ready', 'failed'], default: 'uploaded' },
  extractedTextSample: { type: String },
  error: { type: String },
}, { timestamps: true });

const FlashcardDeckSchema = new Schema({
  _id: { type: String },
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  subjectId: { type: String },
  topicId: { type: String },
  sourceDocumentId: { type: String },
  cardCount: { type: Number, default: 0 },
}, { timestamps: true });

const FlashcardSchema = new Schema({
  _id: { type: String },
  deckId: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  explanation: { type: String, default: '' },
  example: { type: String, default: '' },
  subjectId: { type: String },
  topicId: { type: String },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  box: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  lastReviewedAt: { type: String },
  nextReviewDate: { type: String },
  learned: { type: Boolean, default: false },
}, { timestamps: true });

const NoteSchema = new Schema({
  _id: { type: String },
  userId: { type: String, required: true, index: true },
  subjectId: { type: String },
  topicId: { type: String },
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: String }],
  isAiGenerated: { type: Boolean, default: false },
  sourceType: { type: String, default: 'manual' },
  sourceDocumentId: { type: String },
}, { timestamps: true });

export const MongoUserModel = mongoose.models.User || mongoose.model('User', UserSchema);
export const MongoSubjectModel = mongoose.models.Subject || mongoose.model('Subject', SubjectSchema);
export const MongoTopicModel = mongoose.models.Topic || mongoose.model('Topic', TopicSchema);
export const MongoDocumentModel = mongoose.models.Document || mongoose.model('Document', DocumentSchema);
export const MongoFlashcardDeckModel = mongoose.models.FlashcardDeck || mongoose.model('FlashcardDeck', FlashcardDeckSchema);
export const MongoFlashcardModel = mongoose.models.Flashcard || mongoose.model('Flashcard', FlashcardSchema);
export const MongoNoteModel = mongoose.models.Note || mongoose.model('Note', NoteSchema);

const DocumentSummarySchema = new Schema({
  _id: { type: String },
  documentId: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  documentName: { type: String, required: true },
  summaryType: { type: String, enum: ['detailed', 'quick'], required: true },
  content: { type: String, required: true },
  estimatedPages: { type: Number, default: 1 },
  keyConcepts: [{ type: String }],
  examPoints: [{ type: String }],
  sourceWordCount: { type: Number },
  summaryWordCount: { type: Number },
  targetPagesText: { type: String },
  status: { type: String, default: 'completed' },
  progress: { type: Number, default: 100 },
  currentStep: { type: String },
}, { timestamps: true });

export const MongoDocumentSummaryModel = mongoose.models.DocumentSummary || mongoose.model('DocumentSummary', DocumentSummarySchema);
