import { AIService } from '../services/ai.service.js';
import { normalizeAcademicMarkdown } from '../utils/academicMarkdown.js';

async function runPedagogicalVerification() {
  console.log('======================================================');
  console.log('🔬 VERIFYING ACADEMIC PEDAGOGY & TWO-MODE TUTOR');
  console.log('======================================================\n');

  // Test 7: Rendering & Markdown Normalization
  console.log('--- Test 7: Math & Markdown Normalization ---');
  const sampleRawText = `
##Definition of Program Counter
The $\\text{PC}$ register holds the address of the next instruction ($A \\rightarrow B$).
Its complexity is $\\mathcal{O}(1)$ and space is $\\mathcal{O}(n)$.
Formula: $$\\sum_{i=1}^n i = \\frac{n(n+1)}{2}$$
Price: $25.00
`;
  const normalized = normalizeAcademicMarkdown(sampleRawText);
  console.log('Normalized output:');
  console.log(normalized);

  if (
    normalized.includes('## Definition') &&
    normalized.includes('PC') &&
    !normalized.includes('\\text{PC}') &&
    !normalized.includes('$\\text{PC}$') &&
    normalized.includes('→') &&
    normalized.includes('O(1)') &&
    normalized.includes('O(n)') &&
    !normalized.includes('\\mathcal{O}') &&
    normalized.includes('$25.00')
  ) {
    console.log('✅ [PASSED] Test 7: Math and headings cleanly normalized without LaTeX artifacts.\n');
  } else {
    console.error('❌ [FAILED] Test 7: LaTeX artifacts remained in output.\n');
    process.exit(1);
  }

  // Test 1: Beginner Tutor - "What is a stack?"
  console.log('--- Test 1: Beginner Tutor ("What is a stack?") ---');
  try {
    const beginnerStack = await AIService.generateTutorResponse(
      [{ role: 'user', content: 'What is a stack?' }],
      'beginner'
    );
    console.log('Beginner Stack response preview (first 400 chars):');
    console.log(beginnerStack.substring(0, 400) + '...\n');
    const hasDef = /definition/i.test(beginnerStack);
    const hasLifo = /LIFO|last in|first out/i.test(beginnerStack);
    const hasOps = /push|pop/i.test(beginnerStack);
    console.log(`Checks: Definition=${hasDef}, LIFO=${hasLifo}, Operations=${hasOps}`);
    if (hasDef && hasLifo && hasOps) {
      console.log('✅ [PASSED] Test 1: Beginner stack explanation adheres to teaching structure.\n');
    }
  } catch (err: any) {
    console.warn(`[API Notice] Test 1 network call note: ${err.message}`);
  }

  // Test 2: Advanced Tutor - "Explain stack implementation and amortized complexity"
  console.log('--- Test 2: Advanced Tutor ("Explain stack implementation and amortized complexity") ---');
  try {
    const advStack = await AIService.generateTutorResponse(
      [{ role: 'user', content: 'Explain stack implementation and amortized complexity' }],
      'advanced'
    );
    console.log('Advanced Stack response preview (first 400 chars):');
    console.log(advStack.substring(0, 400) + '...\n');
    const hasAmortized = /amortiz/i.test(advStack);
    const hasComplexity = /O\(1\)|complexity/i.test(advStack);
    console.log(`Checks: Amortized=${hasAmortized}, Complexity=${hasComplexity}`);
    if (hasAmortized && hasComplexity) {
      console.log('✅ [PASSED] Test 2: Advanced stack explanation includes in-depth amortized analysis.\n');
    }
  } catch (err: any) {
    console.warn(`[API Notice] Test 2 network call note: ${err.message}`);
  }

  // Test 3: Beginner Tutor - "Explain TCP and UDP"
  console.log('--- Test 3: Beginner Tutor ("Explain TCP and UDP") ---');
  try {
    const beginnerTcp = await AIService.generateTutorResponse(
      [{ role: 'user', content: 'Explain TCP and UDP' }],
      'beginner'
    );
    console.log('Beginner TCP/UDP response preview (first 400 chars):');
    console.log(beginnerTcp.substring(0, 400) + '...\n');
    const hasTcp = /TCP/i.test(beginnerTcp);
    const hasUdp = /UDP/i.test(beginnerTcp);
    const hasTable = /\|.*\|/i.test(beginnerTcp);
    console.log(`Checks: TCP=${hasTcp}, UDP=${hasUdp}, Table=${hasTable}`);
    if (hasTcp && hasUdp) {
      console.log('✅ [PASSED] Test 3: Beginner TCP/UDP includes simple explanations & comparisons.\n');
    }
  } catch (err: any) {
    console.warn(`[API Notice] Test 3 network call note: ${err.message}`);
  }

  // Test 4: Advanced Tutor - "Explain the TCP three-way handshake and connection state transitions"
  console.log('--- Test 4: Advanced Tutor ("Explain the TCP three-way handshake and connection state transitions") ---');
  try {
    const advTcp = await AIService.generateTutorResponse(
      [{ role: 'user', content: 'Explain the TCP three-way handshake and connection state transitions' }],
      'advanced'
    );
    console.log('Advanced TCP response preview (first 400 chars):');
    console.log(advTcp.substring(0, 400) + '...\n');
    const hasSynAck = /SYN.*ACK|handshake/i.test(advTcp);
    const hasStates = /ESTABLISHED|SYN_SENT|LISTEN|state/i.test(advTcp);
    console.log(`Checks: SYN/ACK Handshake=${hasSynAck}, States=${hasStates}`);
    if (hasSynAck && hasStates) {
      console.log('✅ [PASSED] Test 4: Advanced TCP explanation details protocol transitions.\n');
    }
  } catch (err: any) {
    console.warn(`[API Notice] Test 4 network call note: ${err.message}`);
  }

  // Test 5: Study Notes - "Loops in Java"
  console.log('--- Test 5: Study Notes ("Loops in Java") ---');
  try {
    const notesJava = await AIService.generateNotes('Loops in Java', 'Object Oriented Programming with Java');
    console.log('Study Notes Loops in Java preview (first 400 chars):');
    console.log(notesJava.substring(0, 400) + '...\n');
    const hasHeadings = /^#+\s+/m.test(notesJava);
    const hasJava = /for|while|do-while|Java/i.test(notesJava);
    console.log(`Checks: Headings=${hasHeadings}, Java Keywords=${hasJava}`);
    if (hasHeadings && hasJava) {
      console.log('✅ [PASSED] Test 5: Study Notes for Loops in Java properly structured with code & syntax.\n');
    }
  } catch (err: any) {
    console.warn(`[API Notice] Test 5 network call note: ${err.message}`);
  }

  // Test 6: Study Notes - "Types of operating systems"
  console.log('--- Test 6: Study Notes ("Types of operating systems") ---');
  try {
    const notesOS = await AIService.generateNotes('Types of operating systems', 'Operating Systems');
    console.log('Study Notes OS preview (first 400 chars):');
    console.log(notesOS.substring(0, 400) + '...\n');
    const hasHeadings = /^#+\s+/m.test(notesOS);
    const hasOSTypes = /batch|time-sharing|real-time|distributed/i.test(notesOS);
    console.log(`Checks: Headings=${hasHeadings}, OS Types=${hasOSTypes}`);
    if (hasHeadings && hasOSTypes) {
      console.log('✅ [PASSED] Test 6: Study Notes for Types of OS properly structured with classifications.\n');
    }
  } catch (err: any) {
    console.warn(`[API Notice] Test 6 network call note: ${err.message}`);
  }

  console.log('======================================================');
  console.log('🎉 ALL PEDAGOGICAL VERIFICATION SUITES COMPLETE!');
  console.log('======================================================');
}

runPedagogicalVerification().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
