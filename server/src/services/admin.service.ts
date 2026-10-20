import {
  UsersRepo,
  SubjectsRepo,
  TopicsRepo,
  DocumentsRepo,
  QuizAttemptsRepo,
  StudySessionsRepo,
  AuditLogsRepo,
  AIConversationsRepo,
  AIMessagesRepo,
} from '../models/repositories.js';

export class AdminService {
  static getPlatformStats() {
    const allUsers = UsersRepo.find();
    const students = allUsers.filter(u => u.role === 'student');
    const admins = allUsers.filter(u => u.role === 'admin');
    const activeUsers = allUsers.filter(u => u.isActive);

    const totalDocs = DocumentsRepo.count();
    const totalQuizzes = QuizAttemptsRepo.count();
    const totalSessions = StudySessionsRepo.find();
    const totalStudyHours = Math.round(totalSessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0) / 60);

    const totalConversations = AIConversationsRepo.count();
    const totalAIMessages = AIMessagesRepo.count();
    const totalAuditLogs = AuditLogsRepo.count();

    return {
      users: {
        total: allUsers.length,
        students: students.length,
        admins: admins.length,
        active: activeUsers.length,
      },
      content: {
        subjectsCount: SubjectsRepo.count(),
        topicsCount: TopicsRepo.count(),
        documentsUploaded: totalDocs,
        quizzesCompleted: totalQuizzes,
      },
      engagement: {
        totalStudyHours,
        totalConversations,
        totalAIMessages,
        auditLogsCount: totalAuditLogs,
      },
    };
  }

  static getUsers(query?: string, page = 1, limit = 20) {
    let users = UsersRepo.find();

    if (query && query.trim().length > 0) {
      const q = query.toLowerCase().trim();
      users = users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }

    users.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    const total = users.length;
    const startIndex = (page - 1) * limit;
    const paginated = users.slice(startIndex, startIndex + limit).map(u => {
      const { passwordHash: _, ...safe } = u;
      return safe;
    });

    return {
      users: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  static toggleUserStatus(adminUserId: string, targetUserId: string) {
    const admin = UsersRepo.findById(adminUserId);
    if (!admin || admin.role !== 'admin') throw new Error('Unauthorized.');

    const targetUser = UsersRepo.findById(targetUserId);
    if (!targetUser) throw new Error('User not found.');

    if (targetUser.role === 'admin') {
      throw new Error('Cannot toggle status of administrator accounts.');
    }

    const newStatus = !targetUser.isActive;
    UsersRepo.updateById(targetUserId, { isActive: newStatus });

    AuditLogsRepo.insertOne({
      _id: 'audit_' + Date.now().toString(36),
      userId: adminUserId,
      userEmail: admin.email,
      action: newStatus ? 'USER_ACTIVATED' : 'USER_DEACTIVATED',
      resourceType: 'user',
      resourceId: targetUserId,
      details: { targetEmail: targetUser.email, newStatus },
      timestamp: new Date().toISOString(),
    });

    const { passwordHash: _, ...safe } = UsersRepo.findById(targetUserId)!;
    return safe;
  }

  static getAuditLogs(page = 1, limit = 50) {
    const logs = AuditLogsRepo.find().sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    const total = logs.length;
    const startIndex = (page - 1) * limit;
    const paginated = logs.slice(startIndex, startIndex + limit);

    return {
      logs: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  static getDocumentsForModeration() {
    const docs = DocumentsRepo.find().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return docs.map(d => {
      const owner = UsersRepo.findById(d.userId);
      return {
        ...d,
        ownerEmail: owner?.email || 'Unknown',
        ownerName: owner?.name || 'Unknown',
      };
    });
  }
}
