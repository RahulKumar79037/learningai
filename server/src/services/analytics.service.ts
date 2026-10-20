import {
  UsersRepo,
  SubjectsRepo,
  TopicsRepo,
  ProgressRepo,
  StudyPlansRepo,
  StudyTasksRepo,
  StudySessionsRepo,
  LearningActivitiesRepo,
  QuizAttemptsRepo,
  NotesRepo,
  DocumentsRepo,
  FlashcardDecksRepo,
  FlashcardsRepo,
  RecommendationsRepo,
} from '../models/repositories.js';

export class AnalyticsService {
  static getDashboardData(userId: string) {
    const user = UsersRepo.findById(userId);
    if (!user) throw new Error('User not found.');

    // 1. Study streak & Daily goal
    const studyStreak = user.studyStreak || 0;
    const dailyStudyGoalMinutes = user.dailyStudyGoalMinutes || 60;

    // 2. Study time today & all time
    const todayStr = new Date().toISOString().split('T')[0];
    const sessions = StudySessionsRepo.find(s => s.userId === userId);
    const todaySessions = sessions.filter(s => s.completedAt.startsWith(todayStr));
    const todayStudyMinutes = todaySessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
    const totalStudyMinutes = sessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);

    // 3. Active Study Plan & Tasks
    const activePlan = StudyPlansRepo.findOne(p => p.userId === userId && p.status === 'active');
    const tasks = StudyTasksRepo.find(t => t.userId === userId);
    const pendingTasks = tasks.filter(t => !t.completed).sort((a, b) => (a.priority === 'high' ? -1 : 1));
    const completedTasks = tasks.filter(t => t.completed);

    // 4. Subjects and Progress
    const allSubjects = SubjectsRepo.find().sort((a, b) => a.order - b.order);
    const userProgress = ProgressRepo.find(p => p.userId === userId);

    const subjectProgress = allSubjects.map(sub => {
      const prog = userProgress.find(p => p.subjectId === sub._id);
      const completedCount = prog ? prog.completedTopicIds.length : 0;
      const totalModules = sub.moduleCount || TopicsRepo.count(t => t.subjectSlug === sub.slug) || 1;
      const percentage = Math.min(100, Math.round((completedCount / totalModules) * 100));

      return {
        subjectId: sub._id,
        slug: sub.slug,
        name: sub.name,
        icon: sub.icon,
        completedCount,
        totalModules,
        percentage,
        totalStudyMinutes: prog?.totalStudyMinutes || 0,
        quizCount: prog?.quizCount || 0,
        avgQuizScore: prog?.avgQuizScore || 0,
      };
    });

    // 5. Quiz Performance & Weak Topics Identification
    const attempts = QuizAttemptsRepo.find(a => a.userId === userId).sort((a, b) => b.attemptedAt.localeCompare(a.attemptedAt));
    const totalQuizzesTaken = attempts.length;
    const avgQuizPercentage = totalQuizzesTaken > 0
      ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / totalQuizzesTaken)
      : 0;

    // Extract weak topics from missed questions
    const weakTopicCounts: Record<string, number> = {};
    for (const att of attempts) {
      for (const ans of att.answers) {
        if (!ans.isCorrect && ans.topicTag) {
          weakTopicCounts[ans.topicTag] = (weakTopicCounts[ans.topicTag] || 0) + 1;
        }
      }
      for (const wt of att.weakTopicsIdentified || []) {
        weakTopicCounts[wt] = (weakTopicCounts[wt] || 0) + 1;
      }
    }

    const weakTopics = Object.entries(weakTopicCounts)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 6. Dynamic Recommendations based on actual data
    const recommendations: Array<{
      title: string;
      reason: string;
      actionUrl: string;
      priority: 'high' | 'medium' | 'low';
      badge: string;
    }> = [];

    // Recommendation based on weak topics
    if (weakTopics.length > 0) {
      const primaryWeak = weakTopics[0];
      recommendations.push({
        title: `Strengthen: ${primaryWeak.topic}`,
        reason: `You missed questions related to "${primaryWeak.topic}" in your recent quizzes. Review the module notes and retake a practice test.`,
        actionUrl: '/curriculum',
        priority: 'high',
        badge: 'Weak Topic Review',
      });
    }

    // Recommendation based on incomplete subject
    const leastCompleteSub = [...subjectProgress].sort((a, b) => a.percentage - b.percentage)[0];
    if (leastCompleteSub && leastCompleteSub.percentage < 100) {
      recommendations.push({
        title: `Continue Curriculum: ${leastCompleteSub.name}`,
        reason: `You have completed ${leastCompleteSub.completedCount} of ${leastCompleteSub.totalModules} modules (${leastCompleteSub.percentage}%). Advance your knowledge today.`,
        actionUrl: `/curriculum/${leastCompleteSub.slug}`,
        priority: 'medium',
        badge: 'Curriculum Progress',
      });
    }

    // Recommendation for flashcard review
    const dueFlashcards = FlashcardsRepo.find(f => f.userId === userId && (!f.nextReviewDate || f.nextReviewDate <= new Date().toISOString()));
    if (dueFlashcards.length > 0) {
      recommendations.push({
        title: `Review Spaced Repetition Cards`,
        reason: `You have ${dueFlashcards.length} flashcard${dueFlashcards.length > 1 ? 's' : ''} scheduled for review today. Spaced repetition solidifies long-term retention.`,
        actionUrl: '/flashcards',
        priority: 'medium',
        badge: 'Spaced Repetition',
      });
    }

    // 7. Recent Learning Activities
    const recentActivities = LearningActivitiesRepo.find(a => a.userId === userId)
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
      .slice(0, 6);

    // 8. Recent Items (Notes, Documents, Flashcards)
    const recentNotes = NotesRepo.find(n => n.userId === userId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, 4);

    const recentDocuments = DocumentsRepo.find(d => d.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 4);

    const recentDecks = FlashcardDecksRepo.find(d => d.userId === userId)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, 4);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        studyStreak,
        dailyStudyGoalMinutes,
      },
      stats: {
        todayStudyMinutes,
        totalStudyMinutes,
        studyStreak,
        totalQuizzesTaken,
        avgQuizPercentage,
        pendingTasksCount: pendingTasks.length,
        completedTasksCount: completedTasks.length,
      },
      activePlan,
      pendingTasks: pendingTasks.slice(0, 5),
      completedTasks: completedTasks.slice(0, 5),
      subjectProgress,
      recentActivities,
      recentNotes,
      recentDocuments,
      recentDecks,
      weakTopics,
      recommendations,
      recentQuizAttempts: attempts.slice(0, 5),
    };
  }

  static getAnalyticsTrends(userId: string) {
    // 7-day daily study time trend
    const last7Days: Array<{ date: string; day: string; minutes: number }> = [];
    const sessions = StudySessionsRepo.find(s => s.userId === userId);

    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

      const dayMins = sessions
        .filter(s => s.completedAt.startsWith(dateStr))
        .reduce((sum, s) => sum + (s.durationMinutes || 0), 0);

      last7Days.push({
        date: dateStr,
        day: dayName,
        minutes: dayMins,
      });
    }

    // Quiz score history
    const quizAttempts = QuizAttemptsRepo.find(q => q.userId === userId)
      .sort((a, b) => a.attemptedAt.localeCompare(b.attemptedAt))
      .map(a => ({
        id: a._id,
        title: a.quizTitle.length > 20 ? a.quizTitle.substring(0, 20) + '...' : a.quizTitle,
        percentage: a.percentage,
        date: a.attemptedAt.split('T')[0],
      }));

    return {
      last7Days,
      quizAttempts,
    };
  }
}
