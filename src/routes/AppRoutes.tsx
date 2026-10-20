import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MainLayout } from '../components/layout/MainLayout';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';

// App Pages
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { SubjectsPage } from '../pages/curriculum/SubjectsPage';
import { SubjectDetailPage } from '../pages/curriculum/SubjectDetailPage';
import { TopicDetailPage } from '../pages/curriculum/TopicDetailPage';
import { AiTutorPage } from '../pages/tutor/AiTutorPage';
import { NotesPage } from '../pages/notes/NotesPage';
import { NoteEditorPage } from '../pages/notes/NoteEditorPage';
import { FlashcardsPage } from '../pages/flashcards/FlashcardsPage';
import { FlashcardStudyPage } from '../pages/flashcards/FlashcardStudyPage';
import { QuizListPage } from '../pages/quiz/QuizListPage';
import { QuizTakePage } from '../pages/quiz/QuizTakePage';
import { QuizResultPage } from '../pages/quiz/QuizResultPage';
import { DocumentsPage } from '../pages/documents/DocumentsPage';
import { DocumentDetailPage } from '../pages/documents/DocumentDetailPage';
import { StudyPlannerPage } from '../pages/planner/StudyPlannerPage';
import { AnalyticsPage } from '../pages/analytics/AnalyticsPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { ProfilePage } from '../pages/profile/ProfilePage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-xs text-slate-400">Loading Learning Companion...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

      {/* Protected Routes inside Main Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />

        {/* Curriculum */}
        <Route path="curriculum" element={<SubjectsPage />} />
        <Route path="curriculum/:slug" element={<SubjectDetailPage />} />
        <Route path="curriculum/:subjectSlug/:topicSlug" element={<TopicDetailPage />} />

        {/* AI Tutor */}
        <Route path="tutor" element={<AiTutorPage />} />

        {/* Notes */}
        <Route path="notes" element={<NotesPage />} />
        <Route path="notes/:id" element={<NoteEditorPage />} />

        {/* Flashcards */}
        <Route path="flashcards" element={<FlashcardsPage />} />
        <Route path="flashcards/:id" element={<FlashcardStudyPage />} />

        {/* Quizzes */}
        <Route path="quiz" element={<QuizListPage />} />
        <Route path="quiz/:id" element={<QuizTakePage />} />
        <Route path="quiz/results/:attemptId" element={<QuizResultPage />} />

        {/* Documents & RAG */}
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="documents/:id" element={<DocumentDetailPage />} />

        {/* Study Planner */}
        <Route path="planner" element={<StudyPlannerPage />} />

        {/* Analytics */}
        <Route path="analytics" element={<AnalyticsPage />} />

        {/* Profile */}
        <Route path="profile" element={<ProfilePage />} />

        {/* Admin Console */}
        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
