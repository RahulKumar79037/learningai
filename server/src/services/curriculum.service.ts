import { SubjectsRepo, TopicsRepo, ProgressRepo, LearningActivitiesRepo } from '../models/repositories.js';

export class CurriculumService {
  static getAllSubjects() {
    return SubjectsRepo.find().sort((a, b) => a.order - b.order);
  }

  static getSubjectBySlug(slug: string) {
    const subject = SubjectsRepo.findOne(s => s.slug === slug);
    if (!subject) throw new Error('Subject not found.');
    const topics = TopicsRepo.find(t => t.subjectSlug === slug).sort((a, b) => a.order - b.order);
    return { ...subject, topics };
  }

  static getTopicBySlug(subjectSlug: string, topicSlug: string) {
    const topic = TopicsRepo.findOne(t => t.subjectSlug === subjectSlug && t.slug === topicSlug);
    if (!topic) throw new Error('Topic module not found.');
    const subject = SubjectsRepo.findOne(s => s.slug === subjectSlug);
    return { ...topic, subject };
  }

  static getUserSubjectProgress(userId: string, subjectId: string) {
    return ProgressRepo.findOne(p => p.userId === userId && p.subjectId === subjectId);
  }

  static markTopicCompleted(userId: string, subjectSlug: string, topicSlug: string) {
    const topic = TopicsRepo.findOne(t => t.subjectSlug === subjectSlug && t.slug === topicSlug);
    if (!topic) throw new Error('Topic module not found.');

    const subject = SubjectsRepo.findOne(s => s.slug === subjectSlug);
    if (!subject) throw new Error('Subject not found.');

    let prog = ProgressRepo.findOne(p => p.userId === userId && p.subjectId === subject._id);
    if (!prog) {
      prog = ProgressRepo.insertOne({
        _id: `prog_${userId}_${subject._id}`,
        userId,
        subjectId: subject._id,
        completedTopicIds: [topic._id],
        totalStudyMinutes: topic.estimatedMinutes || 30,
        quizCount: 0,
        avgQuizScore: 0,
        flashcardsReviewed: 0,
        lastStudiedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } else {
      const alreadyCompleted = prog.completedTopicIds.includes(topic._id);
      if (!alreadyCompleted) {
        prog.completedTopicIds.push(topic._id);
        ProgressRepo.updateById(prog._id, {
          completedTopicIds: prog.completedTopicIds,
          totalStudyMinutes: (prog.totalStudyMinutes || 0) + (topic.estimatedMinutes || 30),
          lastStudiedAt: new Date().toISOString(),
        });
      }
    }

    // Record activity
    LearningActivitiesRepo.insertOne({
      _id: 'act_' + Date.now().toString(36),
      userId,
      activityType: 'topic_study',
      title: `Completed module: ${topic.title}`,
      details: `Subject: ${subject.name}. Estimated duration: ${topic.estimatedMinutes} mins.`,
      timestamp: new Date().toISOString(),
    });

    return {
      success: true,
      completedTopicId: topic._id,
      progress: ProgressRepo.findById(prog._id),
    };
  }
}
