import bcrypt from 'bcryptjs';
import { CS_CURRICULUM } from './curriculumData.js';
import {
  UsersRepo,
  SubjectsRepo,
  TopicsRepo,
  StudyPlansRepo,
  StudyTasksRepo,
  ProgressRepo,
  LearningActivitiesRepo,
  NotesRepo,
  FlashcardDecksRepo,
  FlashcardsRepo,
  QuizzesRepo,
  QuizAttemptsRepo,
  AuditLogsRepo,
} from '../models/repositories.js';
import { initDatabase, localStore } from '../config/db.js';

export async function runSeed(silent = false) {
  if (!silent) console.log('Starting Learning Companion database seed...');
  await initDatabase();

  // 1. Seed Users (Idempotent with credential reset)
  const studentEmail = 'student@companion.edu';
  const adminEmail = 'admin@companion.edu';
  const salt = await bcrypt.genSalt(10);
  const studentPasswordHash = await bcrypt.hash('Student@123', salt);
  const adminPasswordHash = await bcrypt.hash('Admin@123', salt);

  let student = UsersRepo.findOne(u => u.email === studentEmail);
  if (!student) {
    student = UsersRepo.insertOne({
      _id: 'user_student_demo_01',
      name: 'Alex Mercer',
      email: studentEmail,
      passwordHash: studentPasswordHash,
      role: 'student',
      isActive: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      dailyStudyGoalMinutes: 90,
      studyStreak: 4,
      lastActiveDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    if (!silent) console.log(`Created demo student: ${studentEmail} (Password: Student@123)`);
  } else {
    // Ensure demo password matches documented credentials
    UsersRepo.updateById(student._id, { passwordHash: studentPasswordHash, isActive: true });
  }

  let admin = UsersRepo.findOne(u => u.email === adminEmail);
  if (!admin) {
    admin = UsersRepo.insertOne({
      _id: 'user_admin_demo_01',
      name: 'Prof. Marcus Vance',
      email: adminEmail,
      passwordHash: adminPasswordHash,
      role: 'admin',
      isActive: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      dailyStudyGoalMinutes: 120,
      studyStreak: 12,
      lastActiveDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    if (!silent) console.log(`Created demo admin: ${adminEmail} (Password: Admin@123)`);
  } else {
    UsersRepo.updateById(admin._id, { passwordHash: adminPasswordHash, isActive: true });
  }

  // 2. Seed Subjects and Topics (Idempotent)
  for (const sub of CS_CURRICULUM) {
    let existingSub = SubjectsRepo.findOne(s => s.slug === sub.slug);
    if (!existingSub) {
      existingSub = SubjectsRepo.insertOne({
        _id: `sub_${sub.slug}`,
        slug: sub.slug,
        name: sub.name,
        description: sub.description,
        category: sub.category,
        icon: sub.icon,
        order: sub.order,
        moduleCount: sub.topics.length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } else {
      SubjectsRepo.updateById(existingSub._id, {
        name: sub.name,
        description: sub.description,
        moduleCount: sub.topics.length,
      });
    }

    // Seed Topics for this Subject
    for (const top of sub.topics) {
      const existingTopic = TopicsRepo.findOne(t => t.subjectSlug === sub.slug && t.slug === top.slug);
      if (!existingTopic) {
        TopicsRepo.insertOne({
          _id: `topic_${sub.slug}_${top.slug}`,
          subjectId: existingSub._id,
          subjectSlug: sub.slug,
          title: top.title,
          slug: top.slug,
          order: top.order,
          estimatedMinutes: top.estimatedMinutes,
          summary: top.summary,
          definition: top.definition,
          detailedExplanation: top.detailedExplanation,
          typesAndClassifications: top.typesAndClassifications,
          importantConcepts: top.importantConcepts,
          practicalApplications: top.practicalApplications,
          codeExamples: top.codeExamples,
          complexityAnalysis: top.complexityAnalysis,
          commonMistakes: top.commonMistakes,
          interviewQuestions: top.interviewQuestions,
          examQuestions: top.examQuestions,
          practiceExercises: top.practiceExercises,
          revisionNotes: top.revisionNotes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }
  }

  // 3. Seed Initial Progress for student
  const dsaSub = SubjectsRepo.findOne(s => s.slug === 'data-structures-and-algorithms');
  const javaSub = SubjectsRepo.findOne(s => s.slug === 'java-programming');
  const dbmsSub = SubjectsRepo.findOne(s => s.slug === 'dbms');

  if (dsaSub && student) {
    const existingProg = ProgressRepo.findOne(p => p.userId === student!._id && p.subjectId === dsaSub._id);
    if (!existingProg) {
      ProgressRepo.insertOne({
        _id: `prog_${student._id}_${dsaSub._id}`,
        userId: student._id,
        subjectId: dsaSub._id,
        completedTopicIds: [`topic_${dsaSub.slug}_complexity-analysis-big-o`, `topic_${dsaSub.slug}_arrays-and-strings-dsa`],
        totalStudyMinutes: 140,
        quizCount: 2,
        avgQuizScore: 85,
        flashcardsReviewed: 24,
        lastStudiedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }

  if (javaSub && student) {
    const existingProg = ProgressRepo.findOne(p => p.userId === student!._id && p.subjectId === javaSub._id);
    if (!existingProg) {
      ProgressRepo.insertOne({
        _id: `prog_${student._id}_${javaSub._id}`,
        userId: student._id,
        subjectId: javaSub._id,
        completedTopicIds: [`topic_${javaSub.slug}_intro-to-java`],
        totalStudyMinutes: 65,
        quizCount: 1,
        avgQuizScore: 90,
        flashcardsReviewed: 15,
        lastStudiedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }

  // 4. Seed Study Plan & Tasks for Student
  if (student) {
    let existingPlan = StudyPlansRepo.findOne(p => p.userId === student!._id && p.status === 'active');
    if (!existingPlan) {
      const today = new Date();
      const end = new Date();
      end.setDate(today.getDate() + 14);

      existingPlan = StudyPlansRepo.insertOne({
        _id: `plan_${student._id}_current`,
        userId: student._id,
        title: 'Core CS Foundations & Algorithms Sprint',
        startDate: today.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0],
        dailyTargetMinutes: 90,
        weeklyTargetHours: 10,
        selectedSubjects: ['data-structures-and-algorithms', 'java-programming', 'dbms'],
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Seed Tasks
      StudyTasksRepo.insertOne({
        _id: 'task_01',
        userId: student._id,
        planId: existingPlan._id,
        subjectId: dsaSub?._id,
        title: 'Master Floyd\'s Cycle Detection in Linked Lists',
        description: 'Implement two-pointer Tortoise & Hare algorithm and solve cycle entry node math.',
        priority: 'high',
        estimatedMinutes: 45,
        completed: false,
        deadline: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      StudyTasksRepo.insertOne({
        _id: 'task_02',
        userId: student._id,
        planId: existingPlan._id,
        subjectId: javaSub?._id,
        title: 'Review Java Generics & PECS Principle',
        description: 'Read Producer Extends, Consumer Super guidelines and generic bounds.',
        priority: 'medium',
        estimatedMinutes: 35,
        completed: true,
        completedAt: new Date().toISOString(),
        deadline: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      StudyTasksRepo.insertOne({
        _id: 'task_03',
        userId: student._id,
        planId: existingPlan._id,
        subjectId: dbmsSub?._id,
        title: 'Practice SQL Window Functions (RANK, DENSE_RANK)',
        description: 'Solve top-earning employee per department queries using PARTITION BY.',
        priority: 'high',
        estimatedMinutes: 40,
        completed: false,
        deadline: new Date(Date.now() + 172800000).toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // 5. Seed Flashcards Deck & Cards
    let existingDeck = FlashcardDecksRepo.findOne(d => d.userId === student!._id);
    if (!existingDeck && dsaSub) {
      existingDeck = FlashcardDecksRepo.insertOne({
        _id: 'deck_dsa_core',
        userId: student._id,
        title: 'DSA High-Frequency Interview Concepts',
        description: 'Core complexity analysis, tree invariants, graph algorithms, and sorting bounds.',
        subjectId: dsaSub._id,
        cardCount: 4,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      FlashcardsRepo.insertOne({
        _id: 'card_01',
        deckId: existingDeck._id,
        userId: student._id,
        question: 'What is the theoretical lower bound for comparison-based sorting algorithms?',
        answer: 'Omega(n log n) comparisons in the worst case.',
        explanation: 'Proven via the decision tree model: a binary decision tree sorting n! permutations requires height h >= log2(n!) = Omega(n log n) by Stirling\'s approximation.',
        example: 'MergeSort and HeapSort achieve this theoretical limit.',
        subjectId: dsaSub._id,
        difficulty: 'medium',
        box: 2,
        reviewCount: 3,
        nextReviewDate: new Date(Date.now() + 86400000).toISOString(),
        learned: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      FlashcardsRepo.insertOne({
        _id: 'card_02',
        deckId: existingDeck._id,
        userId: student._id,
        question: 'What is the time complexity of building a binary heap from an unsorted array of n elements?',
        answer: 'O(n) linear time using bottom-up sift-down.',
        explanation: 'Most nodes are located near the bottom levels where height is small. The mathematical summation sum (h / 2^h) converges to a constant, yielding 2n = O(n) total operations.',
        subjectId: dsaSub._id,
        difficulty: 'hard',
        box: 1,
        reviewCount: 1,
        nextReviewDate: new Date().toISOString(),
        learned: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // 6. Seed Sample Notes
    let existingNote = NotesRepo.findOne(n => n.userId === student!._id);
    if (!existingNote && javaSub) {
      NotesRepo.insertOne({
        _id: 'note_java_memory_model',
        userId: student._id,
        subjectId: javaSub._id,
        title: 'JVM Memory Architecture & Garbage Collection Summary',
        content: `# JVM Memory Architecture & Garbage Collection

## 1. Memory Areas
- **Heap**: Shared runtime data area storing all class instances and arrays. Managed by Garbage Collector.
- **JVM Stack**: Thread-private frames storing local variables, operand stacks, and method return references.
- **Metaspace**: Native memory holding class metadata, constant pool, and static variables.
- **PC Register**: Holds address of currently executing JVM instruction per thread.

## 2. Generational Garbage Collection
1. **Young Generation**:
   - Eden Space: New objects allocated here.
   - Survivor Spaces (S0 & S1): Objects surviving minor GC ping-pong between S0 and S1.
2. **Old Generation (Tenured)**:
   - Holds long-lived objects promoted after surviving threshold tenuring age (default 15).
   - Major / Full GC cleans this generation using algorithms like G1 or ZGC.

## Key Takeaway
Memory leaks in Java typically occur due to unclosed resources or static collections holding references to obsolete objects.`,
        tags: ['Java', 'JVM', 'Garbage Collection', 'Architecture'],
        isAiGenerated: false,
        sourceType: 'manual',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // 7. Seed Sample Quiz & Attempt
    let existingQuiz = QuizzesRepo.findOne(q => q.userId === student!._id);
    if (!existingQuiz && dsaSub) {
      existingQuiz = QuizzesRepo.insertOne({
        _id: 'quiz_dsa_foundations',
        userId: student._id,
        title: 'Data Structures & Algorithms Diagnostic Quiz',
        subjectId: dsaSub._id,
        difficulty: 'intermediate',
        questionCount: 3,
        timeLimitMinutes: 10,
        questions: [
          {
            id: 'q1',
            question: 'What is the worst-case time complexity of searching an element in a balanced Red-Black Tree with n nodes?',
            type: 'mcq',
            options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
            correctAnswer: 'O(log n)',
            explanation: 'A balanced Red-Black Tree guarantees that the tree height never exceeds 2 * log2(n + 1), ensuring O(log n) search, insertion, and deletion.',
            topicTag: 'Trees and BST'
          },
          {
            id: 'q2',
            question: 'True or False: In Java, inserting an element at the end of an ArrayList is always strictly O(1) in all cases.',
            type: 'true_false',
            options: ['True', 'False'],
            correctAnswer: 'False',
            explanation: 'ArrayList append is amortized O(1). When the internal array capacity is exceeded, an O(n) array reallocation and copy occurs.',
            topicTag: 'Complexity Analysis and Big-O Notation'
          },
          {
            id: 'q3',
            question: 'Which algorithm is guaranteed to find the shortest path in an unweighted graph?',
            type: 'mcq',
            options: ['Depth-First Search (DFS)', 'Breadth-First Search (BFS)', 'Dijkstra\'s Algorithm', 'Kruskal\'s Algorithm'],
            correctAnswer: 'Breadth-First Search (BFS)',
            explanation: 'BFS explores vertices level by level, ensuring that the first time a target vertex is reached, the path has minimum edge count.',
            topicTag: 'Graphs, BFS, and DFS'
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Sample attempt
      QuizAttemptsRepo.insertOne({
        _id: 'attempt_01',
        userId: student._id,
        quizId: existingQuiz._id,
        quizTitle: existingQuiz.title,
        subjectId: dsaSub._id,
        score: 3,
        maxScore: 3,
        percentage: 100,
        passed: true,
        timeSpentSeconds: 184,
        answers: [
          {
            questionId: 'q1',
            question: 'What is the worst-case time complexity of searching an element in a balanced Red-Black Tree with n nodes?',
            studentAnswer: 'O(log n)',
            correctAnswer: 'O(log n)',
            isCorrect: true,
            explanation: 'A balanced Red-Black Tree guarantees that the tree height never exceeds 2 * log2(n + 1).',
            topicTag: 'Trees and BST'
          },
          {
            questionId: 'q2',
            question: 'True or False: In Java, inserting an element at the end of an ArrayList is always strictly O(1) in all cases.',
            studentAnswer: 'False',
            correctAnswer: 'False',
            isCorrect: true,
            explanation: 'ArrayList append is amortized O(1).',
            topicTag: 'Complexity Analysis and Big-O Notation'
          },
          {
            questionId: 'q3',
            question: 'Which algorithm is guaranteed to find the shortest path in an unweighted graph?',
            studentAnswer: 'Breadth-First Search (BFS)',
            correctAnswer: 'Breadth-First Search (BFS)',
            isCorrect: true,
            explanation: 'BFS explores vertices level by level.',
            topicTag: 'Graphs, BFS, and DFS'
          }
        ],
        weakTopicsIdentified: [],
        attemptedAt: new Date().toISOString(),
      });
    }

    // 8. Seed Learning Activities
    LearningActivitiesRepo.insertOne({
      _id: 'act_01',
      userId: student._id,
      activityType: 'quiz_attempt',
      title: 'Scored 100% on DSA Diagnostic Quiz',
      details: 'Completed 3 questions in 3 minutes 4 seconds with perfect score.',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    });

    LearningActivitiesRepo.insertOne({
      _id: 'act_02',
      userId: student._id,
      activityType: 'topic_study',
      title: 'Completed Study Module: Complexity Analysis and Big-O',
      details: 'Studied asymptotic notation, amortized analysis, and mathematical proofs.',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    });

    // 9. Seed Audit Log
    AuditLogsRepo.insertOne({
      _id: 'audit_init',
      userEmail: 'system@learningcompanion.edu',
      action: 'SYSTEM_INITIALIZATION',
      resourceType: 'database',
      resourceId: 'seed',
      details: { subjectsCount: CS_CURRICULUM.length, status: 'success' },
      timestamp: new Date().toISOString(),
    });
  }

  localStore.persistNow();
  if (!silent) console.log('✅ Learning Companion seed completed successfully.');
}

// Allow standalone execution: tsx server/src/seed/seed.ts
if (import.meta.url === `file://${process.argv[1]}`) {
  runSeed().catch(err => {
    console.error('Seed error:', err);
    process.exit(1);
  });
}
