export interface SeedSubject {
  slug: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  order: number;
  topics: Array<{
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
  }>;
}

export const CS_CURRICULUM: SeedSubject[] = [
  // 1. JAVA PROGRAMMING
  {
    slug: 'java-programming',
    name: 'Java Programming',
    description: 'Master object-oriented programming, modern Java language features, multithreading, Collections Framework, and enterprise application fundamentals.',
    category: 'Computer Science',
    icon: 'Coffee',
    order: 1,
    topics: [
      {
        title: 'Introduction to Java',
        slug: 'intro-to-java',
        order: 1,
        estimatedMinutes: 30,
        summary: 'History, JVM/JRE/JDK architecture, platform independence, write once run anywhere principle, and first Java program.',
        definition: 'Java is a class-based, object-oriented, concurrent, secure, and general-purpose programming language designed to let application developers write once, run anywhere (WORA).',
        detailedExplanation: 'Java source code (.java) is compiled by javac into intermediate bytecode (.class). This platform-independent bytecode is executed by the Java Virtual Machine (JVM). The JVM uses a ClassLoader, Bytecode Verifier, and Execution Engine (comprising an Interpreter and Just-In-Time JIT Compiler). The Java Runtime Environment (JRE) bundles the JVM with standard core libraries, while the Java Development Kit (JDK) includes the JRE plus development tools like javac, jdb, and javadoc.',
        typesAndClassifications: ['Java SE (Standard Edition)', 'Java EE / Jakarta EE (Enterprise Edition)', 'Java ME (Micro Edition)', 'JavaFX (GUI Applications)'],
        importantConcepts: ['Bytecode vs Machine Code', 'JVM Architecture (ClassLoader, Memory Areas, JIT)', 'JDK vs JRE vs JVM', 'Garbage Collection Fundamentals', 'Write Once, Run Anywhere (WORA)'],
        practicalApplications: ['Enterprise backend services (Spring Boot)', 'Android native applications', 'Big data processing engines (Apache Spark, Hadoop)', 'High-frequency financial trading systems'],
        codeExamples: [
          {
            language: 'java',
            title: 'HelloWorld.java',
            code: `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, Learning Companion!");
    }
}`,
            explanation: 'public gives visibility from anywhere; static allows JVM to invoke without instantiating the class; void indicates no return value; String[] args takes command-line arguments.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'O(1)', spaceComplexity: 'O(1)', explanation: 'Execution of main entry point takes constant time.' },
        commonMistakes: ['Mismatched file name and public class name', 'Forgetting static in main method', 'Misunderstanding that Java is pass-by-value strictly'],
        interviewQuestions: [
          {
            question: 'Why is Java platform independent, but JVM is platform dependent?',
            answer: 'Java source code is compiled into bytecode which runs on any JVM regardless of OS. However, each operating system requires a custom JVM implementation tailored to that OS machine code.',
            tips: 'Highlight the distinction between .class bytecode and native machine code.'
          }
        ],
        examQuestions: [
          {
            question: 'Explain the internal architecture of JVM with a neat diagram.',
            marks: 10,
            solutionGuide: 'Cover ClassLoader subsystem, Memory Areas (Method Area, Heap, JVM Stack, PC Register, Native Method Stack), Execution Engine (Interpreter, JIT Compiler, Garbage Collector), and JNI.'
          }
        ],
        practiceExercises: [
          'Install JDK and compile a program from the terminal using javac and java.',
          'Pass command-line arguments to compute their sum.'
        ],
        revisionNotes: [
          'JDK = JRE + Development Tools',
          'JRE = JVM + Class Libraries',
          'Source code -> javac -> .class bytecode -> JVM (JIT/Interpreter) -> Machine Code'
        ]
      },
      {
        title: 'Variables and Data Types',
        slug: 'variables-and-data-types',
        order: 2,
        estimatedMinutes: 35,
        summary: 'Primitive data types, sizes, ranges, wrapper classes, reference types, type casting, and variable scopes.',
        definition: 'A variable is a named memory location used to store data, while a data type defines the size, range, and layout of values that can be stored.',
        detailedExplanation: 'Java has 8 primitive types: byte (8-bit), short (16-bit), int (32-bit), long (64-bit), float (32-bit IEEE 754), double (64-bit IEEE 754), char (16-bit Unicode UTF-16), and boolean. All numeric types are signed. Reference types hold addresses of objects allocated on the heap. Autoboxing automatically converts primitives to Wrapper classes (e.g., int to Integer). Widening casting is implicit, while narrowing casting requires explicit casts.',
        typesAndClassifications: ['Primitive Data Types (Integral, Floating-point, Char, Boolean)', 'Non-Primitive / Reference Data Types (Classes, Interfaces, Arrays, Enums)'],
        importantConcepts: ['Primitive vs Reference Types', 'Implicit widening vs Explicit narrowing casting', 'Autoboxing and Unboxing', 'Wrapper classes and memory overhead', 'Variable scopes: Local, Instance, Static'],
        practicalApplications: ['Financial arithmetic requiring BigDecimal over double', 'High-throughput caching with primitive arrays', 'API payload serialization'],
        codeExamples: [
          {
            language: 'java',
            title: 'TypeCasting.java',
            code: `int num = 100;
double decimal = num; // Widening (automatic)
double pi = 3.14159;
int truncated = (int) pi; // Narrowing (explicit, loses fractional part)
Integer boxed = num; // Autoboxing`,
            explanation: 'Shows implicit widening and explicit narrowing with precision loss.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'O(1)', spaceComplexity: 'O(1)', explanation: 'Variable allocations on stack are fixed size.' },
        commonMistakes: ['Using double/float for exact financial calculations instead of BigDecimal', 'Integer overflow without exception (wrap-around in two\'s complement)'],
        interviewQuestions: [
          {
            question: 'What is the difference between Integer.valueOf() and new Integer()?',
            answer: 'Integer.valueOf() utilizes an internal cache for values from -128 to 127, avoiding redundant heap allocations, whereas new Integer() always allocates a new object on heap.',
            tips: 'Mention the IntegerCache mechanism.'
          }
        ],
        examQuestions: [
          {
            question: 'Differentiate between primitive data types and reference data types in Java.',
            marks: 5,
            solutionGuide: 'Tabulate: memory location (stack vs heap), default values, nullability, method invocation, and wrapper classes.'
          }
        ],
        practiceExercises: ['Demonstrate integer overflow when adding Integer.MAX_VALUE + 1', 'Benchmark primitive int[] vs List<Integer> memory consumption.'],
        revisionNotes: ['8 primitives: byte(1B), short(2B), int(4B), long(8B), float(4B), double(8B), char(2B), boolean', 'Primitive values live on Stack; objects on Heap']
      },
      {
        title: 'Operators and Expressions',
        slug: 'operators-and-expressions',
        order: 3,
        estimatedMinutes: 25,
        summary: 'Arithmetic, relational, logical, bitwise, shift, ternary, and assignment operators, operator precedence and associativity.',
        definition: 'Operators are special symbols that perform specific operations on one, two, or three operands and return a result.',
        detailedExplanation: 'Java provides arithmetic (+, -, *, /, %), relational (==, !=, <, >, <=, >=), logical (&&, ||, !), bitwise (&, |, ^, ~), bit shift (<<, >>, >>>), and assignment operators. Short-circuit evaluation in && and || avoids evaluating the right operand if the left operand determines the outcome. Bitwise >>> performs an unsigned right shift filling high-order bits with zeroes.',
        typesAndClassifications: ['Unary', 'Binary', 'Ternary (?:)', 'Arithmetic', 'Relational', 'Logical', 'Bitwise & Shift'],
        importantConcepts: ['Short-circuit evaluation (&& vs &)', 'Bitwise shift: <<, >>, and unsigned >>>', 'Operator precedence and associativity table'],
        practicalApplications: ['Fast bit manipulation for permissions and bitmasks', 'Flag toggling in protocol headers'],
        codeExamples: [
          {
            language: 'java',
            title: 'OperatorsDemo.java',
            code: `int a = 8; // 1000 in binary
int shifted = a >> 1; // 4 (0100)
boolean check = (a != 0) && (100 / a > 5); // Short-circuit safe`,
            explanation: 'Right shift divides by 2; short-circuit operator prevents division by zero.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'O(1)', spaceComplexity: 'O(1)', explanation: 'CPU ALU instructions execute in 1-2 clock cycles.' },
        commonMistakes: ['Confusing & and &&', 'Operator precedence misconceptions with + and ternary operator'],
        interviewQuestions: [{ question: 'How does >>> differ from >> in Java?', answer: '>> performs arithmetic right shift preserving sign bit; >>> performs logical right shift inserting 0 into leftmost position.', tips: 'Mention signed vs unsigned bit shifting.' }],
        examQuestions: [{ question: 'Explain short-circuit operators with an example.', marks: 5, solutionGuide: 'Demonstrate && skipping evaluation of second operand when first operand is false.' }],
        practiceExercises: ['Write a program to check if an integer is a power of 2 using bitwise operators in O(1).'],
        revisionNotes: ['&& and || short-circuit; & and | evaluate both sides', '>> preserves sign, >>> shifts zero into sign position']
      },
      {
        title: 'Conditional Statements',
        slug: 'conditional-statements',
        order: 4,
        estimatedMinutes: 30,
        summary: 'if, if-else, else-if ladder, nested if, traditional switch, switch expressions with yield, and pattern matching.',
        definition: 'Conditional statements allow programs to choose different execution paths based on boolean evaluations.',
        detailedExplanation: 'Java includes standard if/else branching and switch statements. In modern Java (Java 14+), switch expressions support comma-separated case labels, lambda arrows (->) that eliminate break statements, and the yield keyword to return values. Java 21+ adds pattern matching for switch, enabling type checks directly inside case branches.',
        typesAndClassifications: ['if-else', 'nested-if', 'else-if ladder', 'traditional switch statement', 'modern switch expression'],
        importantConcepts: ['Fall-through behavior in classic switch', 'Switch expressions with -> arrow syntax', 'Pattern matching for switch in modern Java'],
        practicalApplications: ['Request routing', 'State machine transitions', 'Input validation and branching'],
        codeExamples: [
          {
            language: 'java',
            title: 'ModernSwitch.java',
            code: `String day = "MONDAY";
int numLetters = switch (day) {
    case "MONDAY", "FRIDAY", "SUNDAY" -> 6;
    case "TUESDAY" -> 7;
    case "THURSDAY", "SATURDAY" -> 8;
    case "WEDNESDAY" -> 9;
    default -> throw new IllegalArgumentException("Invalid: " + day);
};`,
            explanation: 'Shows modern switch expression returning a value without break statements.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'O(1) table lookup or O(n) branching', spaceComplexity: 'O(1)', explanation: 'Switch compiles to tableswitch or lookupswitch bytecode.' },
        commonMistakes: ['Missing break causing unintentional fall-through in legacy switch'],
        interviewQuestions: [{ question: 'How does the JVM optimize a switch statement?', answer: 'JVM compiles switch into either tableswitch (dense keys, O(1) jump table) or lookupswitch (sparse keys, O(log n) binary search table).', tips: 'Mention bytecode instructions tableswitch and lookupswitch.' }],
        examQuestions: [{ question: 'Compare if-else ladder with switch-case statement.', marks: 5, solutionGuide: 'Tabulate on readability, expression types supported, speed, and jump table optimization.' }],
        practiceExercises: ['Implement an HTTP status code classifier using switch expressions.'],
        revisionNotes: ['Modern switch uses -> to eliminate fall-through', 'tableswitch is O(1); lookupswitch is O(log n)']
      },
      {
        title: 'Loops and Iteration',
        slug: 'loops-and-iteration',
        order: 5,
        estimatedMinutes: 30,
        summary: 'for, while, do-while, enhanced for-each loop, break, continue, labeled statements.',
        definition: 'Loops are control flow structures that repeatedly execute a block of code as long as a specified condition remains true.',
        detailedExplanation: 'Java provides while (entry-controlled), do-while (exit-controlled, guarantees at least one execution), standard for loop (initialization; condition; increment), and enhanced for-each loop for Iterable collections and arrays. Labeled break and continue allow breaking out of outer nested loops.',
        typesAndClassifications: ['Entry-controlled (for, while)', 'Exit-controlled (do-while)', 'Enhanced for-each loop'],
        importantConcepts: ['Off-by-one errors', 'ConcurrentModificationException in for-each', 'Labeled break/continue statements'],
        practicalApplications: ['Iterating collections', 'Event polling loops', 'Batch record processing'],
        codeExamples: [
          {
            language: 'java',
            title: 'LabeledLoops.java',
            code: `outer: for (int i = 0; i < 5; i++) {
    for (int j = 0; j < 5; j++) {
        if (i * j > 6) break outer;
    }
}`,
            explanation: 'Demonstrates breaking out of outer loop directly from inner loop.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'O(n) or O(n^2)', spaceComplexity: 'O(1)', explanation: 'Determined by loop count and nesting.' },
        commonMistakes: ['Modifying a Collection while iterating with enhanced for-each instead of using Iterator.remove()'],
        interviewQuestions: [{ question: 'What causes ConcurrentModificationException during iteration?', answer: 'Collections like ArrayList track modCount. When an enhanced for loop uses an Iterator, if the list is modified structurally without the Iterator methods, modCount != expectedModCount triggers the exception (fail-fast).', tips: 'Explain modCount and fail-fast behavior.' }],
        examQuestions: [{ question: 'Differentiate between while and do-while loops with syntax.', marks: 5, solutionGuide: 'Entry-controlled vs exit-controlled; condition check timing; guarantee of at least one iteration.' }],
        practiceExercises: ['Write a program using labeled break to find an item in a 2D matrix.'],
        revisionNotes: ['while checks before execution; do-while checks after', 'Enhanced for loop uses Iterator under the hood']
      },
      {
        title: 'Methods and Recursion',
        slug: 'methods-and-recursion',
        order: 6,
        estimatedMinutes: 35,
        summary: 'Method signature, return types, pass-by-value semantics, method overloading, varargs, and recursive call stacks.',
        definition: 'A method is a reusable block of code that performs an operation, while recursion is a technique where a method calls itself to solve smaller subproblems.',
        detailedExplanation: 'Java is strictly pass-by-value. When an object reference is passed, the reference address is copied by value. Method overloading means methods in the same class have the same name but different parameter lists. Recursion relies on the JVM call stack, where each activation record stores local variables and return addresses until the base condition is met; failure to reach the base case results in StackOverflowError.',
        typesAndClassifications: ['Instance methods', 'Static methods', 'Overloaded methods', 'Direct recursion', 'Tail recursion'],
        importantConcepts: ['Strict Pass-by-Value semantics in Java', 'Method Overloading vs Overriding', 'Recursion Base Case and Call Stack Frames', 'StackOverflowError prevention'],
        practicalApplications: ['Tree and graph traversals', 'Divide-and-conquer algorithms (Merge Sort)', 'Mathematical recurrences'],
        codeExamples: [
          {
            language: 'java',
            title: 'FactorialRecursion.java',
            code: `public static long factorial(int n) {
    if (n <= 1) return 1; // Base case
    return n * factorial(n - 1); // Recursive call
}`,
            explanation: 'Base case prevents infinite recursion; call stack collapses upon reaching n=1.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'O(n)', spaceComplexity: 'O(n) auxiliary stack space', explanation: 'Each recursive call allocates a stack frame.' },
        commonMistakes: ['Believing Java passes objects by reference (it passes references by value)'],
        interviewQuestions: [{ question: 'Is Java pass-by-reference or pass-by-value?', answer: 'Java is strictly pass-by-value always. For primitives, the value itself is copied. For objects, the reference (memory address pointer) is copied by value.', tips: 'Illustrate by reassigning a parameter reference inside a method to show it does not affect caller.' }],
        examQuestions: [{ question: 'What is method overloading? State its rules and write a program.', marks: 6, solutionGuide: 'Must differ in parameter type, number, or order. Return type alone is insufficient.' }],
        practiceExercises: ['Write a recursive method to solve the Tower of Hanoi problem.'],
        revisionNotes: ['Java is always pass-by-value', 'Recursion requires base condition to avoid StackOverflowError']
      },
      {
        title: 'Arrays and Strings',
        slug: 'arrays-and-strings',
        order: 7,
        estimatedMinutes: 40,
        summary: '1D and multidimensional arrays, String immutability, String Constant Pool, StringBuilder, and StringBuffer.',
        definition: 'Arrays are fixed-size sequential collections of elements of identical data type, while Strings in Java are immutable sequences of characters.',
        detailedExplanation: 'Arrays are objects stored on the heap with contiguous memory allocation and zero-based indexing. Strings are immutable objects backed by the String Pool to conserve heap memory. Modifying a String creates a new object in heap. StringBuilder is mutable and non-thread-safe (high performance), whereas StringBuffer is synchronized (thread-safe).',
        typesAndClassifications: ['Single-dimensional arrays', 'Jagged / Multidimensional arrays', 'String', 'StringBuilder', 'StringBuffer'],
        importantConcepts: ['String Constant Pool (SCP)', 'Immutability benefits: Security, Caching, Thread safety', 'StringBuilder vs StringBuffer vs String'],
        practicalApplications: ['Fast indexed lookups', 'Safe hash keys in HashMap (String)', 'String concatenation in tight loops with StringBuilder'],
        codeExamples: [
          {
            language: 'java',
            title: 'StringPoolDemo.java',
            code: `String s1 = "Java"; // SCP
String s2 = "Java"; // Points to same literal in SCP
String s3 = new String("Java"); // Explicit Heap allocation
System.out.println(s1 == s2); // true (same reference)
System.out.println(s1 == s3); // false (different objects)
System.out.println(s1.equals(s3)); // true (content comparison)`,
            explanation: 'Shows reference equality (==) vs content equality (.equals()).'
          }
        ],
        complexityAnalysis: { timeComplexity: 'Array access O(1); String concat in loop without StringBuilder O(n^2)', spaceComplexity: 'O(n)', explanation: 'Array indexing uses pointer offset math.' },
        commonMistakes: ['Using == instead of .equals() for String comparison', 'Concatenating strings inside a loop using +'],
        interviewQuestions: [{ question: 'Why is String immutable in Java?', answer: 'Security (class loading, DB credentials), String Constant Pool caching, thread safety without synchronization, and hashcode caching for HashMaps.', tips: 'Mention HashCode caching.' }],
        examQuestions: [{ question: 'Differentiate between String, StringBuffer, and StringBuilder.', marks: 8, solutionGuide: 'Tabulate mutability, thread safety, synchronization overhead, and speed.' }],
        practiceExercises: ['Implement an in-place string reversal algorithm and check for palindrome.'],
        revisionNotes: ['String is immutable; stored in String Constant Pool', 'Use StringBuilder for single-threaded concatenation; StringBuffer for multi-threaded']
      },
      {
        title: 'Object-Oriented Programming Principles',
        slug: 'oop-principles',
        order: 8,
        estimatedMinutes: 45,
        summary: 'The 4 pillars of OOP: Encapsulation, Abstraction, Inheritance, and Polymorphism with design paradigms.',
        definition: 'Object-Oriented Programming (OOP) is a programming paradigm based on the concept of objects containing data fields and operating methods.',
        detailedExplanation: 'OOP structures software around real-world entities. The four primary pillars are: Encapsulation (binding data and methods while hiding internal state via private fields and getters/setters), Abstraction (hiding implementation complexity and exposing essential interfaces via abstract classes and interfaces), Inheritance (reusing attributes and behaviors across hierarchies using extends), and Polymorphism (ability of an entity to take multiple forms at compile-time or runtime).',
        typesAndClassifications: ['Encapsulation', 'Abstraction', 'Inheritance', 'Polymorphism (Static / Dynamic)'],
        importantConcepts: ['Information Hiding', 'Code Reusability', 'Loose Coupling & High Cohesion', 'Open-Closed Principle (SOLID)'],
        practicalApplications: ['Domain-Driven Design', 'Enterprise microservices modeling', 'GUI component libraries'],
        codeExamples: [
          {
            language: 'java',
            title: 'EncapsulationDemo.java',
            code: `public class BankAccount {
    private double balance; // Data hiding

    public void deposit(double amount) {
        if (amount > 0) balance += amount;
    }
    public double getBalance() { return balance; }
}`,
            explanation: 'Protects balance from direct invalid modifications.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'O(1)', spaceComplexity: 'O(1)', explanation: 'Encapsulated field accesses take constant time.' },
        commonMistakes: ['Exposing mutable internal objects via getters without defensive copying'],
        interviewQuestions: [{ question: 'What is the difference between Abstraction and Encapsulation?', answer: 'Abstraction focuses on "what" an object does (hiding complexity), while Encapsulation focuses on "how" to hide internal state and data within boundaries.', tips: 'Abstraction at design level; Encapsulation at implementation level.' }],
        examQuestions: [{ question: 'Discuss the 4 pillars of OOP with suitable Java code illustrations.', marks: 10, solutionGuide: 'Dedicate one section and code snippet to each: Encapsulation, Abstraction, Inheritance, Polymorphism.' }],
        practiceExercises: ['Design a PaymentProcessing system using abstraction and encapsulation.'],
        revisionNotes: ['Encapsulation = Data Hiding', 'Abstraction = Complexity Hiding', 'Inheritance = Code Reuse', 'Polymorphism = Multiple Forms']
      },
      {
        title: 'Classes and Objects',
        slug: 'classes-and-objects',
        order: 9,
        estimatedMinutes: 35,
        summary: 'Constructors (default, parameterized, copy), this keyword, static members, and object lifecycle.',
        definition: 'A class is a blueprint or template from which individual objects are created; an object is a runtime instance of a class with state and behavior.',
        detailedExplanation: 'When an object is created with new, memory is allocated on the heap, instance variables are initialized with default values, and the constructor executes to initialize user state. The this keyword refers to the current object instance. Static fields and methods belong to the class itself rather than any individual instance and reside in the Metaspace/Method Area.',
        typesAndClassifications: ['Concrete classes', 'Abstract classes', 'Inner classes', 'Anonymous classes', 'Record classes (Java 16+)'],
        importantConcepts: ['Constructor overloading and constructor chaining (this())', 'Static vs Instance variables and methods', 'Object lifecycle and Garbage Collection eligibility'],
        practicalApplications: ['DTOs and Domain Models', 'Utility classes (e.g. java.lang.Math) with static members'],
        codeExamples: [
          {
            language: 'java',
            title: 'Student.java',
            code: `public class Student {
    private String name;
    private int id;
    private static int studentCount = 0; // Shared across instances

    public Student(String name, int id) {
        this.name = name;
        this.id = id;
        studentCount++;
    }
    public static int getCount() { return studentCount; }
}`,
            explanation: 'Demonstrates instance initialization and shared static counter.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'Instantiation O(1)', spaceComplexity: 'O(1) per instance', explanation: 'Heap object allocation overhead.' },
        commonMistakes: ['Calling an instance method from a static context without an object reference'],
        interviewQuestions: [{ question: 'Can static methods access instance variables in Java?', answer: 'No, static methods belong to the class and execute without an active instance reference (this is not available in static context).', tips: 'Explain why "this" does not exist in static context.' }],
        examQuestions: [{ question: 'Explain constructor chaining in Java with an example.', marks: 6, solutionGuide: 'Show this(...) calling another constructor in the same class and super(...) calling parent constructor.' }],
        practiceExercises: ['Create an immutable Person class with builder pattern.'],
        revisionNotes: ['Class = Blueprint; Object = Instance on Heap', 'Static belongs to Class; Non-static belongs to Instance']
      },
      {
        title: 'Inheritance and Polymorphism',
        slug: 'inheritance-and-polymorphism',
        order: 10,
        estimatedMinutes: 45,
        summary: 'Single, multilevel, hierarchical inheritance, super keyword, method overriding, dynamic method dispatch, and runtime polymorphism.',
        definition: 'Inheritance is a mechanism where a new class acquires properties of an existing class, and polymorphism allows one interface to control multiple implementations.',
        detailedExplanation: 'Java supports single inheritance for classes (avoiding the diamond problem). The super keyword invokes parent constructors or overridden methods. Method overriding occurs when a subclass provides a specific implementation of a method declared in its superclass with the exact same signature. At runtime, Java resolves the overridden method based on the actual object type via Dynamic Method Dispatch using the vtable.',
        typesAndClassifications: ['Single Inheritance', 'Multilevel Inheritance', 'Hierarchical Inheritance', 'Compile-time Polymorphism (Overloading)', 'Runtime Polymorphism (Overriding)'],
        importantConcepts: ['super keyword usage', 'Dynamic Method Dispatch (Virtual Method Invocation)', 'Covariant return types', '@Override annotation importance'],
        practicalApplications: ['Extending framework base classes (e.g. Spring Security / Android Activity)', 'Plugin architecture with common superclasses'],
        codeExamples: [
          {
            language: 'java',
            title: 'PolymorphismDemo.java',
            code: `class Animal {
    void makeSound() { System.out.println("Generic sound"); }
}
class Dog extends Animal {
    @Override
    void makeSound() { System.out.println("Bark bark!"); }
}
Animal myPet = new Dog(); // Upcasting
myPet.makeSound(); // Output: Bark bark! (Resolved at runtime)`,
            explanation: 'Runtime method lookup calls Dog\'s makeSound method.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'Method dispatch O(1) via virtual method table (vtable)', spaceComplexity: 'O(1)', explanation: 'JVM vtable lookup overhead.' },
        commonMistakes: ['Attempting multiple inheritance with classes instead of interfaces', 'Overriding private or static methods (static methods are shadowed, not overridden)'],
        interviewQuestions: [{ question: 'Can we override static methods in Java?', answer: 'No, static methods are resolved at compile-time based on the reference type (method hiding), not dynamic dispatch at runtime.', tips: 'Distinguish method hiding from method overriding.' }],
        examQuestions: [{ question: 'What is dynamic method dispatch? Explain with a code example.', marks: 8, solutionGuide: 'Explain parent reference pointing to child object and runtime resolution of overridden methods.' }],
        practiceExercises: ['Design a Shape hierarchy with Circle, Rectangle, Triangle and calculate area polymorphically.'],
        revisionNotes: ['Inheritance uses "extends"', 'Dynamic method dispatch resolves methods at runtime via actual heap object']
      },
      {
        title: 'Interfaces and Abstraction',
        slug: 'interfaces-and-abstraction',
        order: 11,
        estimatedMinutes: 40,
        summary: 'Abstract classes vs interfaces, default methods, static methods in interfaces, private interface methods, and multiple inheritance via interfaces.',
        definition: 'An interface is a contract specifying methods a class must implement, enabling multiple inheritance of type and decoupled architecture.',
        detailedExplanation: 'Abstract classes can hold state (instance fields) and constructors, while interfaces traditionally defined purely abstract method signatures. Since Java 8, interfaces support default methods (enabling backward compatibility) and static methods. Since Java 9, private helper methods are permitted in interfaces. A class can implement multiple interfaces, allowing polymorphism across unrelated hierarchies.',
        typesAndClassifications: ['Pure Abstract Interfaces', 'Functional Interfaces (@FunctionalInterface)', 'Marker Interfaces (Serializable, Cloneable)'],
        importantConcepts: ['Abstract Class vs Interface differences', 'Default and static methods (Java 8+)', 'Resolving diamond problem with default methods', 'Functional interfaces and Lambdas'],
        practicalApplications: ['Decoupling API contracts from implementations (JDBC interfaces)', 'Dependency Injection in Spring', 'Event listeners and callback patterns'],
        codeExamples: [
          {
            language: 'java',
            title: 'PaymentGateway.java',
            code: `public interface PaymentGateway {
    boolean processPayment(double amount);
    default void logTransaction(String id) {
        System.out.println("Transaction logged: " + id);
    }
}`,
            explanation: 'Shows contract method and default implementation.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'Interface dispatch O(1) via itable', spaceComplexity: 'O(1)', explanation: 'JVM itable lookup.' },
        commonMistakes: ['Creating an abstract class when an interface is sufficient for defining contracts'],
        interviewQuestions: [{ question: 'When should you use an abstract class versus an interface?', answer: 'Use an abstract class when classes share code, non-static state, or access modifiers. Use an interface when defining a public contract for unrelated classes or when multiple inheritance of type is needed.', tips: 'Contrast "is-a" stateful relationship vs "can-do" contractual capability.' }],
        examQuestions: [{ question: 'Differentiate between abstract class and interface in Java with examples.', marks: 10, solutionGuide: 'Tabulate on: multiple inheritance, instance variables, constructors, speed, and default methods.' }],
        practiceExercises: ['Create a Repository interface with CRUD methods and an InMemoryRepository implementation.'],
        revisionNotes: ['Interfaces achieve 100% abstraction (prior to default methods)', 'A class extends one class, but can implement many interfaces']
      },
      {
        title: 'Exception Handling',
        slug: 'exception-handling',
        order: 12,
        estimatedMinutes: 40,
        summary: 'Throwable hierarchy, checked vs unchecked exceptions, try-catch-finally, try-with-resources (AutoCloseable), custom exceptions, and best practices.',
        definition: 'Exception handling is a mechanism to handle runtime errors gracefully, maintaining regular application flow without unexpected crashes.',
        detailedExplanation: 'The Throwable hierarchy branches into Error (serious system failures like OutOfMemoryError) and Exception. Exceptions branch into Checked (must be caught or declared in throws clause, subclassing Exception) and Unchecked (subclassing RuntimeException, like NullPointerException or IllegalArgumentException). Java 7 introduced try-with-resources, which automatically closes resources implementing AutoCloseable.',
        typesAndClassifications: ['Checked Exceptions (IOException, SQLException)', 'Unchecked Exceptions (RuntimeException)', 'Errors (StackOverflowError, OutOfMemoryError)'],
        importantConcepts: ['try-catch-finally lifecycle', 'try-with-resources and AutoCloseable', 'Custom Exception creation', 'Exception chaining (getCause())'],
        practicalApplications: ['Robust REST API error responses', 'Database transaction rollback upon exceptions', 'Graceful resource deallocation (sockets, file handles)'],
        codeExamples: [
          {
            language: 'java',
            title: 'TryWithResources.java',
            code: `try (BufferedReader br = new BufferedReader(new FileReader("data.txt"))) {
    String line = br.readLine();
    System.out.println(line);
} catch (IOException e) {
    System.err.println("File read failed: " + e.getMessage());
}`,
            explanation: 'br is closed automatically even if an exception occurs.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'Normal path zero cost; exception throw O(stack depth) to generate stack trace', spaceComplexity: 'O(stack depth)', explanation: 'Filling stack trace has overhead.' },
        commonMistakes: ['Swallowing exceptions in empty catch blocks', 'Catching generic Throwable or Exception instead of specific subclasses'],
        interviewQuestions: [{ question: 'What is the difference between checked and unchecked exceptions?', answer: 'Checked exceptions are verified at compile time and require explicit handling (catch or throws). Unchecked exceptions occur at runtime (subclasses of RuntimeException) and indicate programmer bugs or unexpected conditions.', tips: 'Provide examples: IOException vs NullPointerException.' }],
        examQuestions: [{ question: 'Explain the exception hierarchy in Java and write a custom exception class.', marks: 10, solutionGuide: 'Draw Throwable tree; write CustomNotFoundException extending RuntimeException.' }],
        practiceExercises: ['Write a custom InsufficientFundsException and throw it in a withdraw method.'],
        revisionNotes: ['Throwable -> Error, Exception', 'Exception -> RuntimeException (Unchecked) & Checked Exceptions', 'try-with-resources guarantees closing of AutoCloseable']
      },
      {
        title: 'Collections Framework',
        slug: 'collections-framework',
        order: 13,
        estimatedMinutes: 50,
        summary: 'List (ArrayList, LinkedList), Set (HashSet, TreeSet, LinkedHashSet), Map (HashMap, TreeMap), Queue, Deque, equals and hashCode contract.',
        definition: 'The Java Collections Framework is a unified architecture for representing and manipulating collections of objects, providing interfaces, implementations, and algorithms.',
        detailedExplanation: 'The hierarchy roots at Iterable -> Collection -> List, Set, Queue. Map is a separate hierarchy for key-value pairs. ArrayList uses a dynamic resizable array (amortized O(1) append). LinkedList is a doubly-linked list. HashSet is backed by HashMap (O(1) average lookup). TreeSet uses a Red-Black tree (O(log n) ordered operations). HashMap uses an array of buckets; on collision, entries form a linked list, transforming into a balanced red-black tree (TREEIFY_THRESHOLD = 8).',
        typesAndClassifications: ['Lists (ArrayList, LinkedList, Vector)', 'Sets (HashSet, LinkedHashSet, TreeSet)', 'Maps (HashMap, LinkedHashMap, TreeMap, ConcurrentHashMap)', 'Queues/Deques (ArrayDeque, PriorityQueue)'],
        importantConcepts: ['equals() and hashCode() contract', 'HashMap collision resolution (Buckets, linked nodes, red-black tree)', 'Fail-fast vs Fail-safe iterators', 'Comparable vs Comparator interfaces'],
        practicalApplications: ['In-memory caching and indexing', 'Deduplication using Sets', 'Priority task processing using PriorityQueue'],
        codeExamples: [
          {
            language: 'java',
            title: 'CollectionsDemo.java',
            code: `Map<String, Integer> scores = new HashMap<>();
scores.put("Alice", 95);
scores.put("Bob", 88);
scores.forEach((k, v) -> System.out.println(k + ": " + v));`,
            explanation: 'Demonstrates HashMap key-value association and lambda iteration.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'HashMap get/put: O(1) average, O(log n) worst; TreeSet: O(log n)', spaceComplexity: 'O(n)', explanation: 'Amortized resizing and hashing operations.' },
        commonMistakes: ['Overriding equals() without overriding hashCode(), breaking HashMap lookups', 'Modifying keys while stored in a HashSet/HashMap'],
        interviewQuestions: [{ question: 'How does HashMap handle collisions internally in Java 8+?', answer: 'Keys hashing to the same bucket index form a linked list. When bucket size exceeds 8 and total capacity >= 64, the linked list converts into a Red-Black tree (TreeNode), improving worst-case search from O(n) to O(log n).', tips: 'Mention TREEIFY_THRESHOLD (8) and UNTREEIFY_THRESHOLD (6).' }],
        examQuestions: [{ question: 'Explain the internal working of HashMap in Java with a diagram.', marks: 10, solutionGuide: 'Detail hashing, bucket index calculation, collision chaining, and treeification in Java 8.' }],
        practiceExercises: ['Sort a List of Employees by salary descending and then by name using Comparator.'],
        revisionNotes: ['ArrayList: O(1) random access; LinkedList: O(1) insertions at ends', 'HashMap: O(1) average; converts to Red-Black tree at 8 collisions']
      },
      {
        title: 'Generics',
        slug: 'generics',
        order: 14,
        estimatedMinutes: 35,
        summary: 'Type safety, type erasure, generic classes, generic methods, bounded type parameters, and wildcards (? extends T, ? super T).',
        definition: 'Generics enable types (classes and interfaces) to be parameters when defining classes, interfaces, and methods, enforcing compile-time type safety.',
        detailedExplanation: 'Before Generics (pre-Java 5), collections held Objects, requiring manual casts prone to ClassCastException. Generics provide compile-time verification. At compile time, the Java compiler applies Type Erasure, replacing generic parameters with Object (or their first bound) and inserting appropriate casts in the bytecode to preserve backward compatibility. Upper-bounded wildcards (? extends T) provide read access; lower-bounded wildcards (? super T) allow writing (PECS principle: Producer Extends, Consumer Super).',
        typesAndClassifications: ['Generic Types (Classes/Interfaces)', 'Generic Methods', 'Bounded Type Parameters (<T extends Comparable<T>>)', 'Wildcards (? extends T, ? super T, ?)'],
        importantConcepts: ['Type Erasure in JVM', 'PECS Rule (Producer Extends, Consumer Super)', 'Compile-time type safety without runtime performance penalty'],
        practicalApplications: ['Type-safe collections and repository layers', 'Generic response wrappers in Web APIs (e.g., ApiResponse<T>)'],
        codeExamples: [
          {
            language: 'java',
            title: 'GenericBox.java',
            code: `public class Box<T> {
    private T item;
    public void set(T item) { this.item = item; }
    public T get() { return item; }
}`,
            explanation: 'Box can store any specified type safely without manual casting.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'Compile-time validation O(1) runtime', spaceComplexity: 'O(1)', explanation: 'No runtime overhead due to type erasure.' },
        commonMistakes: ['Attempting to create generic arrays (new T[10] is invalid due to type erasure)', 'Using primitive types as generic arguments directly (use Wrapper types)'],
        interviewQuestions: [{ question: 'What is Type Erasure and what are its implications?', answer: 'Type erasure removes all generic type information during compilation to maintain binary compatibility with older Java versions. Consequently, generic type information is unavailable at runtime via reflection unless preserved in superclass signatures.', tips: 'Mention why instanceof List<String> is forbidden.' }],
        examQuestions: [{ question: 'Explain the PECS guideline with a code example.', marks: 8, solutionGuide: 'Producer Extends (read only), Consumer Super (write only); show Collection copy method.' }],
        practiceExercises: ['Implement a generic Stack<T> class with push, pop, and peek.'],
        revisionNotes: ['Generics ensure compile-time type safety', 'PECS: Producer Extends, Consumer Super', 'JVM erases types to Object or upper bound at runtime']
      },
      {
        title: 'Multithreading and Concurrency',
        slug: 'multithreading-and-concurrency',
        order: 15,
        estimatedMinutes: 50,
        summary: 'Thread lifecycle, Runnable vs Callable, synchronization, volatile, deadlock, ExecutorService, and modern Virtual Threads (Project Loom).',
        definition: 'Multithreading is a programming capability that allows multiple threads of execution to run concurrently within a single process to maximize CPU utilization.',
        detailedExplanation: 'Java supports multithreading via Thread class, Runnable, and Callable interfaces. Thread states include NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, and TERMINATED. Synchronization (using synchronized keyword or ReentrantLock) prevents race conditions by acquiring monitor locks. Volatile guarantees memory visibility across CPU caches. Java 5 introduced java.util.concurrent (ExecutorService, CountDownLatch, ConcurrentHashMap). Java 21 introduced Virtual Threads (lightweight threads managed by JVM rather than OS).',
        typesAndClassifications: ['Platform Threads (OS kernel threads)', 'Virtual Threads (Lightweight user-mode threads)', 'Thread Pools (Fixed, Cached, Scheduled)'],
        importantConcepts: ['Thread Lifecycle States', 'Race Conditions and Critical Sections', 'Volatile vs Synchronized', 'Deadlock (Coffman conditions)', 'ExecutorService and Futures'],
        practicalApplications: ['High-throughput HTTP servers handling thousands of concurrent requests', 'Asynchronous background computation and I/O polling'],
        codeExamples: [
          {
            language: 'java',
            title: 'ExecutorDemo.java',
            code: `ExecutorService executor = Executors.newFixedThreadPool(4);
executor.submit(() -> {
    System.out.println("Running task in: " + Thread.currentThread().getName());
});
executor.shutdown();`,
            explanation: 'Runs asynchronous task inside managed thread pool.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'Concurrency reduces wall-clock latency', spaceComplexity: 'Platform thread: ~1MB stack; Virtual thread: ~few hundred bytes', explanation: 'Virtual threads drastically reduce memory footprint.' },
        commonMistakes: ['Forgetting to call shutdown() on ExecutorService causing JVM to hang', 'Deadlock by acquiring locks in inconsistent order'],
        interviewQuestions: [{ question: 'What is the difference between volatile and synchronized in Java?', answer: 'volatile guarantees visibility of variable changes across threads by reading/writing directly to main memory, but does not guarantee atomicity (e.g. count++ is not thread-safe). synchronized guarantees both visibility and mutual exclusion (atomicity).', tips: 'Highlight compound operations like count++.' }],
        examQuestions: [{ question: 'What is deadlock? State the four necessary conditions and how to prevent it.', marks: 10, solutionGuide: 'Mutual exclusion, Hold and wait, No preemption, Circular wait; lock ordering technique.' }],
        practiceExercises: ['Implement the Producer-Consumer problem using wait() and notifyAll().'],
        revisionNotes: ['volatile = visibility; synchronized = visibility + atomicity', 'Virtual threads allow millions of concurrent tasks with minimal memory']
      },
      {
        title: 'File Handling and I/O',
        slug: 'file-handling-and-io',
        order: 16,
        estimatedMinutes: 35,
        summary: 'Byte streams vs Character streams, Buffered I/O, Serialization, and modern Java NIO.2 (Files, Path).',
        definition: 'File handling enables Java programs to read and write data persistently to disk storage using streams and channels.',
        detailedExplanation: 'Java I/O is divided into Byte Streams (InputStream, OutputStream for binary data) and Character Streams (Reader, Writer for 16-bit Unicode text). Buffered streams wrap raw streams to minimize expensive system calls. Java 7 introduced NIO.2 (java.nio.file.Path and Files), providing non-blocking operations, stream transformations, and clean file system utilities. Serialization converts an object into a byte stream for storage or network transport.',
        typesAndClassifications: ['Byte Streams (FileInputStream, FileOutputStream)', 'Character Streams (FileReader, FileWriter)', 'Buffered Streams (BufferedReader, BufferedWriter)', 'Java NIO.2 (Path, Files, Channels)'],
        importantConcepts: ['Byte vs Character streams', 'Buffered I/O performance', 'NIO.2 modern APIs (Files.readAllLines, Files.writeString)', 'Serializable and transient keyword'],
        practicalApplications: ['Configuration file parsing', 'Log file rotation and writing', 'Object persistence and network transmission'],
        codeExamples: [
          {
            language: 'java',
            title: 'ModernNIO.java',
            code: `import java.nio.file.*;
Path path = Paths.get("data.txt");
Files.writeString(path, "Learning Companion Note");
String content = Files.readString(path);
System.out.println(content);`,
            explanation: 'Clean one-line file writing and reading using modern Java NIO.2.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'Sequential I/O O(n)', spaceComplexity: 'O(1) with streaming, O(n) if reading entire file into memory', explanation: 'Buffered streams minimize disk read system calls.' },
        commonMistakes: ['Failing to close file streams causing file descriptor leaks', 'Not declaring serialVersionUID in Serializable classes'],
        interviewQuestions: [{ question: 'What is the role of the transient keyword in Java serialization?', answer: 'The transient keyword prevents a field from being serialized. When the object is deserialized, transient fields receive default values (e.g. null, 0). Useful for sensitive data like passwords.', tips: 'Give security credential example.' }],
        examQuestions: [{ question: 'Compare traditional java.io with modern java.nio.', marks: 6, solutionGuide: 'Blocking vs non-blocking, Stream-oriented vs Buffer/Channel-oriented.' }],
        practiceExercises: ['Write a program to count word frequency in a large text file using Files.lines().'],
        revisionNotes: ['Reader/Writer = 16-bit Unicode; InputStream/OutputStream = 8-bit bytes', 'NIO.2 Files and Path are preferred in modern Java']
      },
      {
        title: 'Java Database Connectivity (JDBC)',
        slug: 'jdbc',
        order: 17,
        estimatedMinutes: 40,
        summary: 'JDBC architecture, Driver, Connection, Statement vs PreparedStatement, CallableStatement, ResultSet, and Connection Pooling.',
        definition: 'JDBC is a standard Java API that connects Java applications to relational database management systems and executes SQL statements.',
        detailedExplanation: 'JDBC workflow involves loading the JDBC driver, obtaining a Connection via DriverManager or DataSource, creating a PreparedStatement with parameterized queries, executing the query to get a ResultSet, processing rows via rs.next(), and closing resources. PreparedStatement precompiles SQL queries on the database server, enhancing performance and completely preventing SQL Injection attacks. Production systems use Connection Pools (e.g., HikariCP) to reuse expensive database sockets.',
        typesAndClassifications: ['JDBC Driver Types: Type 1 (ODBC Bridge), Type 2 (Native API), Type 3 (Network Protocol), Type 4 (Pure Java Thin Driver)'],
        importantConcepts: ['PreparedStatement vs Statement', 'SQL Injection prevention via parameter binding', 'ResultSet cursor traversal', 'Connection Pooling (HikariCP)'],
        practicalApplications: ['Relational persistence in Spring Data JDBC', 'Enterprise batch database migrations', 'Raw database query execution'],
        codeExamples: [
          {
            language: 'java',
            title: 'JdbcDemo.java',
            code: `String sql = "SELECT name, email FROM users WHERE id = ?";
try (Connection conn = dataSource.getConnection();
     PreparedStatement ps = conn.prepareStatement(sql)) {
    ps.setInt(1, 42);
    try (ResultSet rs = ps.executeQuery()) {
        if (rs.next()) {
            System.out.println(rs.getString("name"));
        }
    }
}`,
            explanation: 'Uses PreparedStatement parameter binding to protect against SQL injection.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'PreparedStatement compilation cached O(1) + query time', spaceComplexity: 'O(result rows)', explanation: 'Cursor fetches rows in batches.' },
        commonMistakes: ['Concatenating user input into raw SQL Statement strings, leading to SQL Injection vulnerabilities'],
        interviewQuestions: [{ question: 'Why is PreparedStatement faster and safer than Statement in JDBC?', answer: 'PreparedStatement is precompiled by the database engine and can be reused with different parameters, reducing parsing time. It automatically escapes input parameters, neutralizing SQL injection attacks.', tips: 'Always mention SQL injection security first.' }],
        examQuestions: [{ question: 'Explain the 5 basic steps of connecting a Java program to a database using JDBC.', marks: 10, solutionGuide: '1. Load Driver, 2. Establish Connection, 3. Create Statement, 4. Execute Query, 5. Process ResultSet & Close.' }],
        practiceExercises: ['Write a complete CRUD application using JDBC PreparedStatement and transactions (commit/rollback).'],
        revisionNotes: ['Always use PreparedStatement over Statement to prevent SQL Injection', 'Connection pools like HikariCP keep warm connections']
      },
      {
        title: 'Java Interview Master Questions',
        slug: 'java-interview-questions',
        order: 18,
        estimatedMinutes: 45,
        summary: 'Comprehensive compilation of core Java interview questions, tricky edge cases, and architectural discussions.',
        definition: 'Curated technical interview questions covering JVM memory model, garbage collection algorithms, functional programming, and multithreading.',
        detailedExplanation: 'Top technical interview questions evaluate candidate depth in JVM memory management (Heap, Stack, Metaspace), Garbage Collection mechanisms (G1, ZGC, generational hypothesis), Stream API internals, Optional pattern, and concurrent constructs. Candidates must explain internal trade-offs clearly with code examples.',
        typesAndClassifications: ['Core Language & OOP', 'Memory & Garbage Collection', 'Concurrency & Threading', 'Collections & Performance'],
        importantConcepts: ['Generational Garbage Collection (Young Gen, Old Gen, Eden, Survivor)', 'Java Memory Model (JMM)', 'Stream API lazy evaluation', 'Fail-fast vs fail-safe'],
        practicalApplications: ['Software engineering technical screenings', 'System design implementations in Java'],
        codeExamples: [
          {
            language: 'java',
            title: 'StreamPipeline.java',
            code: `List<String> names = List.of("Alice", "Bob", "Charlie", "David");
List<String> filtered = names.stream()
    .filter(n -> n.length() > 4)
    .map(String::toUpperCase)
    .toList(); // Java 16+`,
            explanation: 'Declarative stream processing with filter and transformation.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'O(n)', spaceComplexity: 'O(k) where k is filtered count', explanation: 'Stream elements pipeline without intermediate collections.' },
        commonMistakes: ['Calling terminal operations multiple times on the same Stream', 'Confusing memory leak with garbage collection delay'],
        interviewQuestions: [
          {
            question: 'How does Garbage Collection work in Java? Describe the Generational Hypothesis.',
            answer: 'Most allocated objects die young. Java divides heap into Young Generation (Eden + Survivor spaces S0, S1) and Old Generation. Minor GC collects short-lived objects from Eden quickly; surviving objects are promoted to Old Generation, where Major/Full GC occurs less frequently.',
            tips: 'Mention Eden, Survivor spaces, and tenure threshold.'
          },
          {
            question: 'What is the contract between equals() and hashCode()?',
            answer: '1. If two objects are equal according to equals(), they must produce the same hashCode(). 2. If two objects have the same hashCode(), they are not necessarily equal (hash collision).',
            tips: 'Highlight that violating rule 1 breaks HashMaps.'
          }
        ],
        examQuestions: [
          {
            question: 'Explain Java Memory Model including Stack, Heap, and Metaspace.',
            marks: 10,
            solutionGuide: 'Stack stores primitive local variables and method frames; Heap stores objects; Metaspace stores class metadata and static variables.'
          }
        ],
        practiceExercises: ['Implement a LRU Cache in Java using LinkedHashMap.'],
        revisionNotes: ['equals() and hashCode() must be overridden together', 'Young Gen: Eden + S0 + S1; Old Gen holds long-lived objects']
      }
    ]
  },

  // 2. DATA STRUCTURES AND ALGORITHMS
  {
    slug: 'data-structures-and-algorithms',
    name: 'Data Structures and Algorithms',
    description: 'Foundations of computer science: asymptotic complexity analysis, linear and non-linear structures, sorting, trees, graphs, and dynamic programming.',
    category: 'Computer Science',
    icon: 'Binary',
    order: 2,
    topics: [
      {
        title: 'Complexity Analysis and Big-O Notation',
        slug: 'complexity-analysis-big-o',
        order: 1,
        estimatedMinutes: 35,
        summary: 'Asymptotic notation (Big-O, Big-Omega, Big-Theta), worst-case, best-case, average-case, and amortized complexity.',
        definition: 'Big-O notation is a mathematical notation that describes the limiting behavior of a function when the argument tends towards a particular value or infinity, classifying algorithms according to their running time or space requirements.',
        detailedExplanation: 'Asymptotic analysis evaluates how algorithm performance scales as input size n approaches infinity, independent of machine architecture. Big-O represents the asymptotic upper bound (worst-case growth rate), Big-Omega (Ω) represents the lower bound (best-case), and Big-Theta (Θ) represents a tight bound where upper and lower bounds match. Common complexity classes in order: O(1) constant < O(log n) logarithmic < O(n) linear < O(n log n) linearithmic < O(n^2) quadratic < O(2^n) exponential < O(n!) factorial.',
        typesAndClassifications: ['Time Complexity', 'Space Complexity (Auxiliary space vs Total space)', 'Amortized Complexity', 'Average vs Worst vs Best case'],
        importantConcepts: ['Dominant term rule', 'Ignoring constants and lower-order terms', 'Amortized analysis (e.g. ArrayList doubling is amortized O(1))', 'Space complexity auxiliary stack space'],
        practicalApplications: ['Selecting optimal algorithms for production scalability', 'Code profiling and performance bottleneck analysis'],
        codeExamples: [
          {
            language: 'java',
            title: 'ComplexityExamples.java',
            code: `// O(1) Constant
int getFirst(int[] arr) { return arr[0]; }

// O(log n) Binary Search
int binarySearch(int[] arr, int target) {
    int l = 0, r = arr.length - 1;
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (arr[m] == target) return m;
        if (arr[m] < target) l = m + 1;
        else r = m - 1;
    }
    return -1;
}`,
            explanation: 'Halving search space at each iteration achieves O(log n) complexity.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'Comparison table: O(1) to O(n!)', spaceComplexity: 'O(1) extra space', explanation: 'Classifies algorithm efficiency.' },
        commonMistakes: ['Assuming recursive algorithms with no loops are automatically O(1)', 'Ignoring auxiliary stack space in recursion when calculating space complexity'],
        interviewQuestions: [{ question: 'What is Amortized Time Complexity? Give an example.', answer: 'Amortized time is the average time taken per operation over a sequence of operations. For example, inserting into a dynamic array (ArrayList) is usually O(1), but occasionally triggers an O(n) array resizing. Spread across n insertions, the average cost per insertion is amortized O(1).', tips: 'Use dynamic array resizing as the canonical illustration.' }],
        examQuestions: [{ question: 'Define Big-O, Big-Omega, and Big-Theta notations with formal mathematical definitions and graphs.', marks: 10, solutionGuide: 'Write definitions: f(n) <= c*g(n) for n >= n0; draw growth curve charts.' }],
        practiceExercises: ['Find the time and space complexity of computing the n-th Fibonacci number recursively vs iteratively.'],
        revisionNotes: ['Big-O = Upper bound; Big-Omega = Lower bound; Big-Theta = Tight bound', 'Growth: O(1) < O(log n) < O(n) < O(n log n) < O(n^2) < O(2^n) < O(n!)']
      },
      {
        title: 'Arrays and Strings in DSA',
        slug: 'arrays-and-strings-dsa',
        order: 2,
        estimatedMinutes: 40,
        summary: 'Contiguous memory, 2-pointer technique, sliding window, prefix sums, and Kadane\'s algorithm.',
        definition: 'An array is a data structure consisting of a collection of elements identified by index, stored in contiguous memory locations.',
        detailedExplanation: 'Contiguous memory allocation allows O(1) random access via index arithmetic: address = base_address + index * element_size. Key algorithmic patterns on arrays include: Two-Pointer Technique (converging from opposite ends or fast/slow pointer), Sliding Window (tracking subarray metrics in O(n) instead of O(n^2)), Prefix Sum Arrays (answering range sum queries in O(1) after O(n) preprocessing), and Kadane\'s algorithm for maximum subarray sum in O(n).',
        typesAndClassifications: ['Static Arrays', 'Dynamic Arrays', '2D / Matrix Representations', 'Subarrays vs Subsequences vs Subsets'],
        importantConcepts: ['Two-Pointer Pattern', 'Sliding Window Pattern (Fixed and Variable size)', 'Prefix Sum Arrays', 'Kadane\'s Maximum Subarray Algorithm'],
        practicalApplications: ['Time-series sliding metrics', 'Image pixel buffers', 'Stock price fluctuation analysis'],
        codeExamples: [
          {
            language: 'java',
            title: 'KadanesAlgorithm.java',
            code: `public static int maxSubArray(int[] nums) {
    int maxSoFar = nums[0];
    int currentMax = nums[0];
    for (int i = 1; i < nums.length; i++) {
        currentMax = Math.max(nums[i], currentMax + nums[i]);
        maxSoFar = Math.max(maxSoFar, currentMax);
    }
    return maxSoFar;
}`,
            explanation: 'Calculates maximum subarray sum in single pass O(n) time and O(1) space.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'O(n) time', spaceComplexity: 'O(1) auxiliary space', explanation: 'Optimal single pass traversal.' },
        commonMistakes: ['Integer overflow when calculating midpoint: use low + (high - low) / 2 instead of (low + high) / 2'],
        interviewQuestions: [{ question: 'Explain the Sliding Window technique with an example problem.', answer: 'The sliding window maintains a window over an array/string defined by two pointers (left and right). Instead of recalculating the window properties in O(k), we slide the window by adding the incoming element and subtracting the outgoing element in O(1), reducing overall time from O(n*k) to O(n).', tips: 'Give Maximum Sum Subarray of size K as example.' }],
        examQuestions: [{ question: 'Write an algorithm for Kadane\'s method to find the maximum sum contiguous subarray.', marks: 8, solutionGuide: 'Explain local maximum vs global maximum; step-by-step trace on array [-2,1,-3,4,-1,2,1,-5,4].' }],
        practiceExercises: ['Solve the Longest Substring Without Repeating Characters problem using a sliding window and HashSet.'],
        revisionNotes: ['Two pointers: O(n) time for sorted array search and palindromes', 'Sliding window: converts nested O(n^2) subarray problems to O(n)', 'Kadane: max(nums[i], currentMax + nums[i])']
      },
      {
        title: 'Linked Lists',
        slug: 'linked-lists',
        order: 3,
        estimatedMinutes: 45,
        summary: 'Singly linked lists, doubly linked lists, circular lists, pointer reversal, Floyd\'s cycle detection, and merge sort on lists.',
        definition: 'A linked list is a linear data structure where elements (nodes) are stored non-contiguously in memory, with each node containing data and a reference (pointer) to the next node.',
        detailedExplanation: 'Unlike arrays, linked lists allow O(1) insertions and deletions at known pointer locations without shifting elements, at the cost of O(n) sequential access. Singly linked lists point forward; doubly linked lists point forward and backward. Key techniques include dummy head nodes to simplify edge cases, in-place pointer reversal, and Floyd\'s Cycle Detection (Tortoise and Hare algorithm using slow and fast pointers).',
        typesAndClassifications: ['Singly Linked List', 'Doubly Linked List', 'Circular Singly Linked List', 'Circular Doubly Linked List', 'Skip List'],
        importantConcepts: ['Dummy Head pointer technique', 'Pointer manipulation order (preventing orphan nodes)', 'Floyd\'s Cycle Detection (Tortoise and Hare)', 'Fast and slow pointer to find midpoint'],
        practicalApplications: ['Undo/Redo history (Doubly linked list)', 'OS memory allocation free lists', 'Blockchain block linkage'],
        codeExamples: [
          {
            language: 'java',
            title: 'ReverseLinkedList.java',
            code: `class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}
public static ListNode reverseList(ListNode head) {
    ListNode prev = null, curr = head;
    while (curr != null) {
        ListNode nextTemp = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}`,
            explanation: 'Reverses pointers in-place in O(n) time and O(1) auxiliary space.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'Search: O(n); Insertion at head: O(1); Deletion at head: O(1)', spaceComplexity: 'O(1) extra space', explanation: 'Node pointer updates take constant time.' },
        commonMistakes: ['Losing the reference to the rest of the list when updating next pointers', 'NullPointerException when accessing fast.next.next without checking fast.next != null'],
        interviewQuestions: [{ question: 'How does Floyd\'s Cycle Detection algorithm work and how do you find the start of the cycle?', answer: 'Use slow pointer (1 step) and fast pointer (2 steps). If they meet, a cycle exists. To find the entry node: reset slow to head, keep fast at meeting point, and advance both 1 step at a time; they will meet at the cycle start due to modular distance math (2(F + a) = F + a + nC => F = nC - a).', tips: 'Derive the mathematical proof step.' }],
        examQuestions: [{ question: 'Write an algorithm to reverse a singly linked list iteratively and recursively.', marks: 10, solutionGuide: 'Present both iterative pointer tracking and recursive stack unwinding approaches.' }],
        practiceExercises: ['Merge two sorted linked lists into one sorted linked list in O(n) time and O(1) extra space.'],
        revisionNotes: ['Insertion at head: O(1); search: O(n)', 'Floyd cycle detection: slow (1 step) meets fast (2 steps)', 'Dummy head prevents null checks on edge insertions']
      },
      {
        title: 'Stacks and Queues',
        slug: 'stacks-and-queues',
        order: 4,
        estimatedMinutes: 40,
        summary: 'LIFO and FIFO principles, array and linked list implementations, Monotonic Stack, Circular Queue, and Deque.',
        definition: 'A stack is a LIFO (Last-In-First-Out) linear data structure, while a queue is a FIFO (First-In-First-Out) linear data structure.',
        detailedExplanation: 'Stacks support push, pop, and peek in O(1). They power function call stacks, balanced parenthesis checking, and expression evaluation (infix to postfix). Monotonic Stacks maintain elements in strictly increasing or decreasing order, solving Next Greater Element in O(n). Queues support enqueue and dequeue in O(1). Circular Queues utilize modulo arithmetic ((rear + 1) % capacity) to prevent memory waste in fixed arrays. Deques (Double-Ended Queues) allow O(1) operations at both ends.',
        typesAndClassifications: ['Stack (Array-based, Linked-list based)', 'Queue (Simple Queue, Circular Queue, PriorityQueue, Deque)', 'Monotonic Stack / Monotonic Queue'],
        importantConcepts: ['LIFO vs FIFO properties', 'Expression evaluation (Infix, Prefix, Postfix)', 'Balanced parentheses validation', 'Next Greater Element using Monotonic Stack'],
        practicalApplications: ['JVM method call execution stack', 'Browser back/forward history (Dual stacks)', 'Printer task spooling (FIFO queue)', 'BFS graph traversal (Queue)'],
        codeExamples: [
          {
            language: 'java',
            title: 'BalancedParentheses.java',
            code: `public static boolean isValid(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    for (char c : s.toCharArray()) {
        if (c == '(') stack.push(')');
        else if (c == '{') stack.push('}');
        else if (c == '[') stack.push(']');
        else if (stack.isEmpty() || stack.pop() != c) return false;
    }
    return stack.isEmpty();
}`,
            explanation: 'Uses ArrayDeque as stack to validate balanced brackets in O(n) time.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'Push/Pop/Enqueue/Dequeue: O(1)', spaceComplexity: 'O(n)', explanation: 'All fundamental operations take constant time.' },
        commonMistakes: ['Using java.util.Stack (which is synchronized and extends legacy Vector) instead of ArrayDeque'],
        interviewQuestions: [{ question: 'How do you implement a Queue using two Stacks?', answer: 'Use stackIn for enqueue operations (push to stackIn). For dequeue: if stackOut is empty, transfer all elements from stackIn to stackOut (reversing their order to FIFO); then pop from stackOut. Amortized time per operation is O(1).', tips: 'Emphasize that each element is moved at most twice, giving amortized O(1).' }],
        examQuestions: [{ question: 'Convert the following infix expression to postfix using a stack: (A + B) * (C - D) / E', marks: 8, solutionGuide: 'Show step-by-step table with scanned symbol, stack state, and postfix expression output.' }],
        practiceExercises: ['Find the Next Greater Element for each element in an array using a monotonic stack.'],
        revisionNotes: ['Stack = LIFO; Queue = FIFO', 'Use ArrayDeque instead of legacy Stack', 'Monotonic stack solves Next Greater Element in O(n)']
      },
      {
        title: 'Hashing and Hash Tables',
        slug: 'hashing-and-hash-tables',
        order: 5,
        estimatedMinutes: 40,
        summary: 'Hash functions, collision resolution (chaining vs open addressing), load factor, rehashing, and two-sum problem.',
        definition: 'Hashing is a technique that maps large keys to smaller fixed-size table indices using a mathematical hash function, enabling constant-time average operations.',
        detailedExplanation: 'A Hash Table maps keys to values. A good hash function distributes keys uniformly across table slots. When two keys hash to the same index (collision), resolution strategies include Separate Chaining (each bucket points to a linked list or red-black tree) and Open Addressing (Linear Probing, Quadratic Probing, Double Hashing). Load Factor (α = n / m) measures table fullness; when α exceeds a threshold (typically 0.75), the table rehashes by doubling its capacity.',
        typesAndClassifications: ['Separate Chaining', 'Open Addressing (Linear Probing, Quadratic Probing, Double Hashing)', 'Direct Addressing Tables'],
        importantConcepts: ['Hash function properties: Determinism, Uniformity, Speed', 'Load Factor and Dynamic Rehashing', 'Hash collisions and birthday paradox', 'Worst-case O(n) vs average-case O(1)'],
        practicalApplications: ['Database index lookups', 'Distributed caching (Redis, Memcached)', 'Compiler symbol tables', 'Cryptographic verification'],
        codeExamples: [
          {
            language: 'java',
            title: 'TwoSum.java',
            code: `public static int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[]{ map.get(complement), i };
        }
        map.put(nums[i], i);
    }
    return new int[]{};
}`,
            explanation: 'Reduces Two-Sum from O(n^2) brute force to O(n) time using HashMap lookup.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'Average: O(1) for insert/search/delete; Worst: O(n)', spaceComplexity: 'O(n)', explanation: 'Uniform distribution provides average constant time.' },
        commonMistakes: ['Clustering in linear probing when hash collisions group together into long contiguous runs'],
        interviewQuestions: [{ question: 'What is the difference between Separate Chaining and Open Addressing?', answer: 'Separate chaining stores collided elements in external data structures (linked lists/trees) at each bucket slot; capacity is unbounded. Open addressing stores all elements inside the table array itself, probing alternate empty slots upon collision; table cannot exceed array capacity without rehashing.', tips: 'Mention cache locality advantages of open addressing vs pointer overhead of chaining.' }],
        examQuestions: [{ question: 'Explain collision resolution techniques in hash tables with suitable diagrams.', marks: 10, solutionGuide: 'Detail separate chaining, linear probing, quadratic probing, and double hashing formulas.' }],
        practiceExercises: ['Design a custom HashMap with put, get, and remove using separate chaining.'],
        revisionNotes: ['Average time: O(1); Worst time: O(n)', 'Separate Chaining: uses linked lists/trees at buckets', 'Open Addressing: probes for next empty slot inside table']
      },
      {
        title: 'Searching and Sorting Algorithms',
        slug: 'searching-and-sorting',
        order: 6,
        estimatedMinutes: 50,
        summary: 'Binary Search, Quick Sort (partition schemes), Merge Sort, Heap Sort, Counting Sort, stability, and comparison sort lower bound.',
        definition: 'Searching algorithms retrieve stored information from data structures, while sorting algorithms rearrange elements into numerical or lexicographical order.',
        detailedExplanation: 'Binary Search requires a sorted array, dividing search space in half each step (O(log n)). Comparison sorting algorithms cannot beat O(n log n) in the worst case (proven by decision trees). Merge Sort divides array into halves, recursively sorts, and merges them in O(n log n) time and O(n) space (stable). Quick Sort picks a pivot, partitions elements around the pivot, and recursively sorts; average O(n log n), worst O(n^2) if pivot is poorly chosen. Counting Sort sorts in O(n + k) non-comparison time for bounded integer ranges.',
        typesAndClassifications: ['Comparison Sorts (Merge, Quick, Heap, Bubble, Insertion, Selection)', 'Non-Comparison Sorts (Counting, Radix, Bucket)', 'Stable vs Unstable Sorting'],
        importantConcepts: ['Divide-and-Conquer paradigm', 'Lomuto vs Hoare partition schemes in QuickSort', 'Stability: preserving relative order of equal keys', 'O(n log n) theoretical lower bound for comparison sorting'],
        practicalApplications: ['Database query result ordering (ORDER BY)', 'Search engine indexing', 'Graphics rendering depth sorting'],
        codeExamples: [
          {
            language: 'java',
            title: 'MergeSort.java',
            code: `public static void mergeSort(int[] arr, int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}
private static void merge(int[] arr, int l, int m, int r) {
    int[] left = Arrays.copyOfRange(arr, l, m + 1);
    int[] right = Arrays.copyOfRange(arr, m + 1, r + 1);
    int i = 0, j = 0, k = l;
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) arr[k++] = left[i++];
        else arr[k++] = right[j++];
    }
    while (i < left.length) arr[k++] = left[i++];
    while (j < right.length) arr[k++] = right[j++];
}`,
            explanation: 'Guarantees O(n log n) time in all cases with stable element ordering.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'Merge Sort: O(n log n) always; Quick Sort: O(n log n) avg, O(n^2) worst; Counting Sort: O(n + k)', spaceComplexity: 'Merge Sort: O(n); Quick Sort: O(log n) stack', explanation: 'Comparison lower bound is Omega(n log n).' },
        commonMistakes: ['Assuming QuickSort is always faster than MergeSort (QuickSort has poor worst-case if pivot is extremal)'],
        interviewQuestions: [{ question: 'Why is QuickSort preferred over MergeSort for arrays, but MergeSort preferred for linked lists?', answer: 'For arrays, QuickSort has better cache locality and in-place O(log n) stack space without O(n) auxiliary allocation. For linked lists, elements are non-contiguous anyway, and MergeSort can merge lists in O(1) auxiliary space without extra node copying.', tips: 'Highlight CPU cache locality and in-place partitioning.' }],
        examQuestions: [{ question: 'Prove that any comparison-based sorting algorithm requires at least Omega(n log n) comparisons in the worst case.', marks: 10, solutionGuide: 'Use decision tree model: n! permutations require tree height h >= log2(n!) = Omega(n log n) by Stirling\'s approximation.' }],
        practiceExercises: ['Implement QuickSort with random pivot selection and 3-way partitioning for duplicate keys.'],
        revisionNotes: ['MergeSort: O(n log n) guaranteed, stable, O(n) space', 'QuickSort: O(n log n) average, unstable, in-place', 'CountingSort: O(n + k) non-comparison sort']
      },
      {
        title: 'Trees and Binary Search Trees (BST)',
        slug: 'trees-and-bst',
        order: 7,
        estimatedMinutes: 50,
        summary: 'Tree terminology, traversals (Inorder, Preorder, Postorder, Level Order), BST properties, validation, and LCA.',
        definition: 'A tree is a non-linear hierarchical data structure consisting of nodes connected by edges, with a root node and subtrees.',
        detailedExplanation: 'A Binary Tree has at most 2 children per node. Binary Search Tree (BST) maintains the invariant: all nodes in the left subtree have keys < root key, and all nodes in the right subtree have keys > root key. Inorder traversal of a BST yields elements in strictly sorted ascending order. Operations (search, insert, delete) run in O(h) time, where h is tree height (O(log n) if balanced, O(n) if skewed). Self-balancing trees (AVL, Red-Black) maintain h = O(log n).',
        typesAndClassifications: ['Full Binary Tree', 'Complete Binary Tree', 'Perfect Binary Tree', 'Binary Search Tree (BST)', 'Balanced Trees (AVL, Red-Black)'],
        importantConcepts: ['Inorder, Preorder, Postorder, and Level-order (BFS) traversals', 'BST search, insertion, and 3-case node deletion (0, 1, or 2 children)', 'Lowest Common Ancestor (LCA)', 'Validating BST with bounds (min, max)'],
        practicalApplications: ['Hierarchical file system directories', 'Database indexing (B-Trees / B+ Trees)', 'Abstract Syntax Trees (AST) in compilers'],
        codeExamples: [
          {
            language: 'java',
            title: 'ValidateBST.java',
            code: `public static boolean isValidBST(TreeNode root) {
    return validate(root, null, null);
}
private static boolean validate(TreeNode node, Integer low, Integer high) {
    if (node == null) return true;
    if ((low != null && node.val <= low) || (high != null && node.val >= high)) {
        return false;
    }
    return validate(node.left, low, node.val) && validate(node.right, node.val, high);
}`,
            explanation: 'Validates BST using range constraints passed down recursively.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'Traversals: O(n); BST Search/Insert/Delete: O(h) where h is O(log n) balanced or O(n) skewed', spaceComplexity: 'O(h) recursion stack', explanation: 'Height governs tree efficiency.' },
        commonMistakes: ['Validating BST by checking only immediate children instead of the entire subtree range'],
        interviewQuestions: [{ question: 'How do you delete a node with two children from a Binary Search Tree?', answer: 'Find the node\'s inorder successor (smallest node in right subtree) or inorder predecessor (largest in left subtree). Copy its value to the target node, then recursively delete that successor node (which has at most one child).', tips: 'Walk through the 3 deletion cases: leaf, 1 child, 2 children.' }],
        examQuestions: [{ question: 'Write algorithms for Inorder, Preorder, and Postorder tree traversals recursively and iteratively.', marks: 10, solutionGuide: 'Provide code and demonstrate traversal orders on a sample 7-node tree.' }],
        practiceExercises: ['Find the Lowest Common Ancestor (LCA) of two nodes in a Binary Search Tree.'],
        revisionNotes: ['Inorder traversal of BST gives sorted keys', 'Balanced BST operations take O(log n); skewed tree degenerates to O(n) linked list']
      },
      {
        title: 'Heaps and Priority Queues',
        slug: 'heaps-and-priority-queues',
        order: 8,
        estimatedMinutes: 45,
        summary: 'Min-Heap and Max-Heap, array representation, heapify algorithm (O(n) build-heap), HeapSort, and Top-K elements.',
        definition: 'A binary heap is a complete binary tree that satisfies the heap property: in a max-heap, every parent node is >= its children; in a min-heap, every parent node is <= its children.',
        detailedExplanation: 'Because a binary heap is a complete binary tree, it can be compactly stored in an array without pointer overhead. For node at index i: parent is (i - 1) / 2, left child is 2*i + 1, right child is 2*i + 2. Insertion adds element at the end and bubbles up (sift-up) in O(log n). Extracting root moves the last element to root and sifts down in O(log n). Building a heap from an arbitrary array takes O(n) time using bottom-up sift-down (Build-Heap theorem).',
        typesAndClassifications: ['Min-Heap', 'Max-Heap', 'Binary Heap', 'Fibonacci Heap', 'Binomial Heap'],
        importantConcepts: ['Array index math for binary heap', 'Sift-up and Sift-down operations', 'Build-Heap in O(n) time vs O(n log n) repeated insertions', 'HeapSort: O(n log n) in-place unstable sort'],
        practicalApplications: ['Dijkstra\'s shortest path algorithm', 'Prim\'s minimum spanning tree algorithm', 'Top-K frequent items / median tracking', 'Operating system task priority scheduling'],
        codeExamples: [
          {
            language: 'java',
            title: 'KthLargest.java',
            code: `public static int findKthLargest(int[] nums, int k) {
    // Min-heap keeps top k largest elements
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();
    for (int num : nums) {
        minHeap.offer(num);
        if (minHeap.size() > k) {
            minHeap.poll();
        }
    }
    return minHeap.peek();
}`,
            explanation: 'Finds k-th largest element in O(n log k) time using a min-heap of size k.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'Insert/Extract: O(log n); Peek: O(1); Build Heap: O(n)', spaceComplexity: 'O(n)', explanation: 'Build heap theorem sum converges to O(n).' },
        commonMistakes: ['Believing Build-Heap takes O(n log n) time (bottom-up sift-down is proven O(n))'],
        interviewQuestions: [{ question: 'Why does building a binary heap take O(n) time instead of O(n log n)?', answer: 'In bottom-up heap construction, most nodes are near the bottom of the tree where height is small. Summing nodes * height across levels yields sum_{h=0}^{log n} (n / 2^(h+1)) * h = n * sum (h / 2^h), which mathematically converges to 2n = O(n).', tips: 'Explain that leaves (n/2 nodes) require 0 swaps.' }],
        examQuestions: [{ question: 'Explain HeapSort with an example and analyze its time and space complexity.', marks: 10, solutionGuide: '1. Build max heap O(n), 2. Swap root with end and heapify O(n log n); show total O(n log n) time and O(1) space.' }],
        practiceExercises: ['Design a Data Stream Median Finder using a Max-Heap and Min-Heap.'],
        revisionNotes: ['Complete binary tree stored in contiguous array', 'Parent: (i-1)/2; Left: 2i+1; Right: 2i+2', 'Build Heap is O(n); Insert/Delete is O(log n)']
      },
      {
        title: 'Graphs, BFS, and DFS',
        slug: 'graphs-bfs-dfs',
        order: 9,
        estimatedMinutes: 50,
        summary: 'Graph representations (Adjacency List vs Matrix), Breadth-First Search (queue), Depth-First Search (stack/recursion), cycle detection, and topological sort.',
        definition: 'A graph is a non-linear data structure consisting of a finite set of vertices (nodes) and edges connecting pairs of vertices.',
        detailedExplanation: 'Graphs can be directed or undirected, weighted or unweighted. Representations include Adjacency Matrix (O(V^2) space, O(1) edge lookup) and Adjacency List (O(V + E) space, optimal for sparse graphs). BFS explores neighbor by neighbor using a Queue, finding the shortest path in unweighted graphs. DFS explores deep along each branch using recursion or a Stack, used for cycle detection, topological sorting (Kahn\'s algorithm or DFS post-order), and connected components.',
        typesAndClassifications: ['Directed and Undirected Graphs', 'Weighted and Unweighted Graphs', 'Cyclic and Acyclic Graphs (DAG)', 'Bipartite Graphs'],
        importantConcepts: ['Adjacency List vs Adjacency Matrix trade-offs', 'BFS for shortest path in unweighted graphs', 'DFS for connectivity, cycle detection, topological sort', 'Visited array to prevent infinite cycles'],
        practicalApplications: ['Social networks (friend recommendations)', 'Road routing navigation (GPS)', 'Dependency resolution in package managers (npm, maven via Topological Sort)'],
        codeExamples: [
          {
            language: 'java',
            title: 'BfsGraph.java',
            code: `public static void bfs(int start, List<List<Integer>> adj, int numVertices) {
    boolean[] visited = new boolean[numVertices];
    Queue<Integer> queue = new ArrayDeque<>();
    visited[start] = true;
    queue.offer(start);
    while (!queue.isEmpty()) {
        int u = queue.poll();
        System.out.print(u + " ");
        for (int v : adj.get(u)) {
            if (!visited[v]) {
                visited[v] = true;
                queue.offer(v);
            }
        }
    }
}`,
            explanation: 'Traverses connected graph component level-by-level in O(V + E) time.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'BFS & DFS: O(V + E) with Adjacency List; O(V^2) with Adjacency Matrix', spaceComplexity: 'O(V) for visited array and queue/call stack', explanation: 'Each vertex and edge visited once.' },
        commonMistakes: ['Forgetting to mark a vertex as visited when pushing to queue in BFS, causing duplicate queue entries'],
        interviewQuestions: [{ question: 'How do you detect a cycle in a directed graph versus an undirected graph?', answer: 'In an undirected graph, DFS detects a cycle if an adjacent visited node is not the parent. In a directed graph, that is insufficient; DFS must track nodes currently in the recursion stack (back-edges) using a 3-state coloring (Unvisited, Visiting, Visited).', tips: 'Highlight back-edges and 3-color states for directed graphs.' }],
        examQuestions: [{ question: 'Explain Topological Sorting of a Directed Acyclic Graph (DAG) using Kahn\'s Algorithm (indegree).', marks: 10, solutionGuide: 'Compute in-degrees, push 0 in-degree nodes to queue, process and decrement neighbor in-degrees.' }],
        practiceExercises: ['Implement Course Schedule problem using Kahn\'s topological sort to detect cyclic prerequisites.'],
        revisionNotes: ['Adjacency List takes O(V + E) space; Matrix takes O(V^2)', 'BFS uses Queue and finds unweighted shortest path', 'DFS uses Stack/Recursion and detects cycles']
      },
      {
        title: 'Greedy Algorithms and Dynamic Programming',
        slug: 'greedy-and-dynamic-programming',
        order: 10,
        estimatedMinutes: 55,
        summary: 'Greedy choice property, optimal substructure, overlapping subproblems, memoization vs tabulation, 0/1 Knapsack, and LCS.',
        definition: 'Greedy algorithms make the locally optimal choice at each step hoping for a global optimum, while Dynamic Programming solves problems with overlapping subproblems and optimal substructure by caching results.',
        detailedExplanation: 'Greedy works when local choices guarantee global optimality (e.g. Fractional Knapsack, Dijkstra, Huffman Coding). When greedy fails, Dynamic Programming (DP) is required. DP solves problems having: 1. Optimal Substructure (optimal solution contains optimal solutions to subproblems) and 2. Overlapping Subproblems (subproblems recur repeatedly). DP approaches include Top-Down with Memoization (recursive + cache) and Bottom-Up with Tabulation (iterative table building). Classic problems: 0/1 Knapsack, Longest Common Subsequence (LCS), Coin Change.',
        typesAndClassifications: ['Greedy vs Dynamic Programming', 'Top-Down DP (Memoization)', 'Bottom-Up DP (Tabulation)', '1D DP vs 2D Grid DP'],
        importantConcepts: ['Greedy Choice Property', 'Optimal Substructure Theorem', 'Overlapping Subproblems property', 'State representation and transitions in DP'],
        practicalApplications: ['Resource scheduling and bandwidth allocation', 'Text diff comparison tools (LCS / git diff)', 'Financial portfolio optimization'],
        codeExamples: [
          {
            language: 'java',
            title: 'CoinChangeDP.java',
            code: `public static int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);
    dp[0] = 0;
    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (i - coin >= 0) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}`,
            explanation: 'Computes minimum coins to make amount using bottom-up tabulation in O(amount * coins) time.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'Coin Change: O(amount * n); 0/1 Knapsack: O(n * W)', spaceComplexity: 'O(amount) or O(W)', explanation: 'Pseudo-polynomial time complexity based on numeric capacity.' },
        commonMistakes: ['Attempting to apply greedy heuristics to 0/1 Knapsack where dynamic programming is strictly required'],
        interviewQuestions: [{ question: 'What is the difference between Memoization and Tabulation in Dynamic Programming?', answer: 'Memoization is Top-Down, executing recursively from original problem and caching results on demand. Tabulation is Bottom-Up, iteratively filling a table starting from base cases, avoiding recursion stack overflow and often allowing space optimization.', tips: 'Mention recursion stack overhead vs cache locality.' }],
        examQuestions: [{ question: 'Formulate the 0/1 Knapsack problem and derive its Dynamic Programming recurrence relation with a complete algorithm.', marks: 10, solutionGuide: 'Recurrence: dp[i][w] = max(dp[i-1][w], val[i-1] + dp[i-1][w-wt[i-1]]); trace on table.' }],
        practiceExercises: ['Solve Longest Common Subsequence (LCS) and reconstruct the common string.'],
        revisionNotes: ['Greedy: local optimal = global optimal', 'DP: optimal substructure + overlapping subproblems', 'Memoization is Top-Down; Tabulation is Bottom-Up']
      }
    ]
  },

  // 3. DATABASE MANAGEMENT SYSTEMS (DBMS)
  {
    slug: 'dbms',
    name: 'Database Management Systems',
    description: 'Relational data modeling, SQL queries, normalization, ACID properties, transactions, concurrency control, B-Tree indexing, and query optimization.',
    category: 'Computer Science',
    icon: 'Database',
    order: 3,
    topics: [
      {
        title: 'Database Fundamentals and Architecture',
        slug: 'dbms-fundamentals',
        order: 1,
        estimatedMinutes: 35,
        summary: 'File system vs DBMS, 3-Schema Architecture, Data Independence, DDL, DML, DCL, and TCL.',
        definition: 'A Database Management System (DBMS) is software that manages collections of related data, providing efficient, secure, and reliable data storage, retrieval, and modification.',
        detailedExplanation: 'Traditional file systems suffer from data redundancy, inconsistency, difficult concurrent access, and security issues. The ANSI/SPARC 3-Schema Architecture decouples database representation into: 1. External Level (user views), 2. Conceptual Level (logical schema of tables, relations, constraints), and 3. Internal Level (physical storage on disk, indexes, file organization). Logical Data Independence isolates external views from conceptual changes; Physical Data Independence isolates conceptual schema from physical storage modifications.',
        typesAndClassifications: ['Relational DBMS (RDBMS: PostgreSQL, MySQL, Oracle)', 'NoSQL (Document, Key-Value, Columnar, Graph)', 'NewSQL / Distributed SQL'],
        importantConcepts: ['3-Schema ANSI/SPARC Architecture', 'Physical vs Logical Data Independence', 'Data Redundancy and Anomaly prevention', 'SQL command types: DDL, DML, DQL, DCL, TCL'],
        practicalApplications: ['Core banking transaction ledgers', 'E-commerce inventory and customer databases', 'Hospital patient management systems'],
        codeExamples: [
          {
            language: 'sql',
            title: 'DdlDmlCommands.sql',
            code: `-- DDL: Data Definition Language
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- DML: Data Manipulation Language
INSERT INTO students (name, email) VALUES ('Alice Smith', 'alice@edu.org');`,
            explanation: 'Shows schema definition (DDL) and record insertion (DML).'
          }
        ],
        complexityAnalysis: { timeComplexity: 'Index lookup O(log n); Full table scan O(n)', spaceComplexity: 'Disk blocks storage', explanation: 'DBMS accesses pages via buffer pool manager.' },
        commonMistakes: ['Confusing logical schema with physical table file allocation on disk'],
        interviewQuestions: [{ question: 'What is Data Independence in DBMS and why is it important?', answer: 'Data Independence allows modifying schema definition at one level without altering schema at the next higher level. Logical independence allows altering table structure without modifying application views. Physical independence allows reorganizing disk storage or indexes without altering table definitions.', tips: 'Contrast logical vs physical independence.' }],
        examQuestions: [{ question: 'Explain the 3-tier ANSI/SPARC architecture of DBMS with a neat diagram.', marks: 10, solutionGuide: 'Draw External, Conceptual, and Internal levels with mappings and explain data independence.' }],
        practiceExercises: ['Design a conceptual schema for a University Course Registration System.'],
        revisionNotes: ['File systems have redundancy and anomalies; DBMS solves them', '3 levels: External, Conceptual, Internal', 'Physical data independence: modify disk without breaking queries']
      },
      {
        title: 'Entity-Relationship (ER) Modeling',
        slug: 'er-modeling',
        order: 2,
        estimatedMinutes: 40,
        summary: 'Entities, attributes (simple, composite, multivalued, derived), relationships, cardinalities, weak entities, and ER-to-Relational mapping.',
        definition: 'Entity-Relationship (ER) modeling is a conceptual data modeling approach that visually describes data entities, their attributes, and relationships in a business domain.',
        detailedExplanation: 'An Entity is a distinguishable real-world object. Attributes can be simple, composite (e.g. Name: First, Last), multivalued (e.g. PhoneNumbers), or derived (e.g. Age computed from DOB). Relationships represent associations between entities with cardinality ratios (1:1, 1:N, M:N) and participation constraints (total vs partial). A Weak Entity cannot be identified uniquely by its own attributes alone and depends on an identifying relationship with a strong entity via a partial key (discriminator).',
        typesAndClassifications: ['Entities (Strong vs Weak)', 'Attributes (Simple, Composite, Multivalued, Derived, Key)', 'Relationships (One-to-One, One-to-Many, Many-to-Many)'],
        importantConcepts: ['Primary keys vs Foreign keys', 'Weak entity sets and identifying relationships', 'Converting ER diagrams into relational tables', 'Handling Many-to-Many via junction tables'],
        practicalApplications: ['System design blueprints for new applications', 'Database refactoring and enterprise data governance'],
        codeExamples: [
          {
            language: 'sql',
            title: 'JunctionTable.sql',
            code: `-- Mapping Many-to-Many (M:N) relationship between Students and Courses
CREATE TABLE student_courses (
    student_id INT REFERENCES students(id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(id) ON DELETE CASCADE,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    PRIMARY KEY (student_id, course_id)
);`,
            explanation: 'Junction table resolves M:N relationship with composite primary key.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'Join queries on foreign key indexes O(log n)', spaceComplexity: 'Normalized relational storage', explanation: 'Foreign keys index lookups.' },
        commonMistakes: ['Attempting to store multivalued attributes directly in a single column instead of creating a separate related table'],
        interviewQuestions: [{ question: 'How is a Weak Entity set converted into relational schema?', answer: 'A weak entity set becomes a table containing all its simple attributes plus the primary key of its identifying strong entity as a foreign key. The primary key of the new table is the combination of the strong entity primary key and the weak entity partial key (discriminator).', tips: 'Mention partial key / discriminator.' }],
        examQuestions: [{ question: 'Draw an ER diagram for a Hospital Management System showing all attributes, relationships, cardinalities, and weak entities.', marks: 10, solutionGuide: 'Include Patient, Doctor, Department, Appointment, Ward, and Treatment entities.' }],
        practiceExercises: ['Convert an M:N ER diagram with attributes on the relationship into relational tables.'],
        revisionNotes: ['Rectangles = Entities; Diamonds = Relationships; Ovals = Attributes; Double rectangle = Weak entity', 'M:N relationship requires an associative/junction table']
      },
      {
        title: 'Relational Model, Keys, and Constraints',
        slug: 'relational-model-keys',
        order: 3,
        estimatedMinutes: 35,
        summary: 'Tuples, attributes, domains, Candidate Key, Primary Key, Super Key, Foreign Key, and Integrity Constraints.',
        definition: 'The Relational Model represents data in relations (tables) consisting of rows (tuples) and columns (attributes), enforcing constraints to maintain integrity.',
        detailedExplanation: 'In the relational model, each table represents a relation with unordered unique tuples. A Super Key is any set of attributes that uniquely identifies a tuple. A Candidate Key is a minimal Super Key. One candidate key is chosen as the Primary Key (unique and NOT NULL). An Alternate Key is any unchosen candidate key. A Foreign Key is a set of attributes referencing the primary key of another table, enforcing Referential Integrity (cascading actions: CASCADE, SET NULL, RESTRICT). Domain Constraints enforce valid attribute types.',
        typesAndClassifications: ['Super Key', 'Candidate Key', 'Primary Key', 'Alternate Key', 'Foreign Key', 'Composite Key'],
        importantConcepts: ['Entity Integrity constraint (Primary key cannot be null)', 'Referential Integrity constraint (Foreign key must match valid primary key or be null)', 'Domain integrity and CHECK constraints'],
        practicalApplications: ['Preventing orphaned records in e-commerce orders and customer accounts', 'Enforcing business rules at the database engine level'],
        codeExamples: [
          {
            language: 'sql',
            title: 'ConstraintsDemo.sql',
            code: `CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL,
    order_amount NUMERIC(10, 2) CHECK (order_amount > 0),
    order_status VARCHAR(20) DEFAULT 'PENDING',
    CONSTRAINT fk_customer FOREIGN KEY (customer_id) 
        REFERENCES customers(id) ON DELETE RESTRICT
);`,
            explanation: 'Enforces primary key, check constraint, and referential integrity with ON DELETE RESTRICT.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'Foreign key constraint check on insert O(log n)', spaceComplexity: 'Index overhead for primary/foreign keys', explanation: 'Index lookup on referenced table.' },
        commonMistakes: ['Deleting parent record when foreign key constraint is set to RESTRICT without deleting dependent child records'],
        interviewQuestions: [{ question: 'What is the difference between a Super Key and a Candidate Key?', answer: 'A Super Key is any attribute combination that uniquely identifies a tuple, but may contain redundant attributes. A Candidate Key is a minimal super key with no extraneous attributes; removing any attribute destroys uniqueness.', tips: 'Give Candidate Key as minimal Super Key.' }],
        examQuestions: [{ question: 'Explain Entity Integrity and Referential Integrity constraints with examples.', marks: 8, solutionGuide: 'Define Entity Integrity (PK not null and unique) and Referential Integrity (FK validity, ON DELETE rules).' }],
        practiceExercises: ['Write SQL DDL demonstrating PRIMARY KEY, FOREIGN KEY with ON DELETE CASCADE, and CHECK constraints.'],
        revisionNotes: ['Candidate Key = Minimal Super Key', 'Entity Integrity: Primary Key cannot be NULL', 'Referential Integrity: Foreign Key must reference valid existing record or NULL']
      },
      {
        title: 'SQL: Queries, Joins, and Subqueries',
        slug: 'sql-joins-subqueries',
        order: 4,
        estimatedMinutes: 50,
        summary: 'SELECT, WHERE, GROUP BY, HAVING, ORDER BY, INNER JOIN, LEFT/RIGHT/FULL OUTER JOIN, correlated subqueries, and window functions.',
        definition: 'SQL (Structured Query Language) is the standard declarative language used to query, manipulate, and define data in relational databases.',
        detailedExplanation: 'SQL statements execute in a specific logical order: FROM & JOIN -> WHERE -> GROUP BY -> HAVING -> SELECT -> DISTINCT -> ORDER BY -> LIMIT. Joins combine rows from multiple tables based on related columns: INNER JOIN (only matching rows), LEFT OUTER JOIN (all left rows + matching right rows), RIGHT OUTER JOIN, and FULL OUTER JOIN. Subqueries can be scalar, multi-row (IN, ANY, ALL), or Correlated (inner query references outer query row-by-row). Window functions (ROW_NUMBER, RANK, DENSE_RANK, OVER (PARTITION BY ...)) compute calculations across row partitions without collapsing rows like GROUP BY.',
        typesAndClassifications: ['Inner Join', 'Left Outer Join', 'Right Outer Join', 'Full Outer Join', 'Cross Join / Cartesian Product', 'Self Join'],
        importantConcepts: ['Logical query processing order', 'WHERE (filters rows before aggregation) vs HAVING (filters aggregated groups)', 'Correlated vs Non-correlated Subqueries', 'Window functions: ROW_NUMBER(), DENSE_RANK(), SUM() OVER()'],
        practicalApplications: ['Complex financial reporting and analytics', 'User order aggregation and rank computation', 'ETL pipelines and business intelligence dashboards'],
        codeExamples: [
          {
            language: 'sql',
            title: 'JoinsAndWindow.sql',
            code: `-- Top earning employee per department using Window Function
WITH RankedEmployees AS (
    SELECT 
        e.name, 
        d.department_name, 
        e.salary,
        DENSE_RANK() OVER (PARTITION BY e.dept_id ORDER BY e.salary DESC) as rank
    FROM employees e
    INNER JOIN departments d ON e.dept_id = d.id
)
SELECT name, department_name, salary
FROM RankedEmployees
WHERE rank = 1;`,
            explanation: 'Uses INNER JOIN and DENSE_RANK window function partitioned by department.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'Hash Join: O(M + N); Nested Loop Join: O(M * N) without index; Window function: O(N log N)', spaceComplexity: 'Hash table memory buffer', explanation: 'Query planner selects optimal join algorithm.' },
        commonMistakes: ['Using WHERE to filter aggregated functions instead of HAVING', 'Accidental Cartesian product when join condition is omitted'],
        interviewQuestions: [{ question: 'What is the difference between RANK() and DENSE_RANK() window functions in SQL?', answer: 'Both assign ranks based on ordered values. When there are ties, RANK() skips subsequent ranks (e.g., 1, 2, 2, 4), while DENSE_RANK() does not skip rank values (e.g., 1, 2, 2, 3).', tips: 'Provide the sequence 1, 2, 2, 4 vs 1, 2, 2, 3.' }],
        examQuestions: [{ question: 'Explain all types of SQL Joins with syntax, Venn diagrams, and example queries.', marks: 10, solutionGuide: 'Detail Inner, Left Outer, Right Outer, Full Outer, and Self Join.' }],
        practiceExercises: ['Write a query to find the second highest salary without using LIMIT or TOP keywords.'],
        revisionNotes: ['Execution order: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY', 'WHERE filters rows; HAVING filters aggregated groups', 'DENSE_RANK does not skip numbers after ties']
      },
      {
        title: 'Normalization and Functional Dependencies',
        slug: 'normalization-functional-dependencies',
        order: 5,
        estimatedMinutes: 50,
        summary: 'Anomalies (insert, update, delete), Functional Dependencies, Armstrong\'s Axioms, 1NF, 2NF, 3NF, and BCNF.',
        definition: 'Normalization is the systematic process of organizing relational database tables to minimize data redundancy and eliminate insertion, update, and deletion anomalies.',
        detailedExplanation: 'Unnormalized tables cause: 1. Insertion Anomaly (cannot insert attribute without unrelated data), 2. Deletion Anomaly (deleting one fact accidentally deletes unrelated facts), and 3. Update Anomaly (modifying data requires updating multiple duplicate rows). Functional Dependency (X -> Y) means X uniquely determines Y. Normal forms progression: 1NF (atomic values, no repeating groups), 2NF (in 1NF and no partial dependencies on candidate key), 3NF (in 2NF and no transitive dependencies; every non-prime attribute is non-transitively dependent on candidate keys), BCNF (Boyce-Codd Normal Form: for every functional dependency X -> Y, X must be a super key).',
        typesAndClassifications: ['1NF (First Normal Form)', '2NF (Second Normal Form)', '3NF (Third Normal Form)', 'BCNF (Boyce-Codd Normal Form)', '4NF & 5NF'],
        importantConcepts: ['Insertion, Update, and Deletion Anomalies', 'Functional Dependencies and Attribute Closure calculation', 'Prime vs Non-Prime attributes', 'Lossless Join Decomposition and Dependency Preservation'],
        practicalApplications: ['Designing robust transactional databases (OLTP)', 'Eliminating data corruption in enterprise financial systems'],
        codeExamples: [
          {
            language: 'text',
            title: 'Decomposition.txt',
            code: `Given Table: Enrollment(StudentID, CourseID, Instructor, Office)
FDs: 
  {StudentID, CourseID} -> {Instructor, Office}
  Instructor -> Office (Transitive Dependency on non-candidate key)

Decomposition to 3NF/BCNF:
Table 1: CourseInstructor(CourseID, Instructor, Office) with Instructor -> Office
Table 2: StudentEnrollment(StudentID, CourseID)
Eliminates redundancy and update anomalies.`,
            explanation: 'Decomposes transitive dependency into separate relation.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'Attribute closure computation O(n * |FD|)', spaceComplexity: 'Reduced redundant storage', explanation: 'Saves disk space and avoids redundant writes.' },
        commonMistakes: ['Decomposing tables without verifying Lossless Join decomposition property (R1 ∩ R2 -> R1 or R1 ∩ R2 -> R2)'],
        interviewQuestions: [{ question: 'What is the difference between 3NF and BCNF?', answer: 'In 3NF, for every functional dependency X -> Y, either X is a super key OR Y is a prime attribute (part of any candidate key). BCNF is stricter: X MUST be a super key for every dependency X -> Y, with no exception for prime attributes.', tips: 'Highlight the "Y is a prime attribute" relaxation in 3NF.' }],
        examQuestions: [{ question: 'Given a relation R(A, B, C, D, E) and FDs {A -> BC, CD -> E, B -> D, E -> A}. Find the candidate keys and determine the highest normal form.', marks: 10, solutionGuide: 'Compute attribute closures for A+, B+, etc. Determine candidate keys {A}, {E}, {CD}, {BC}. Check B -> D violations to classify NF.' }],
        practiceExercises: ['Check whether decomposition of R(A, B, C, D) with FDs into R1(A, B) and R2(B, C, D) is lossless.'],
        revisionNotes: ['1NF = Atomic values only', '2NF = No partial dependency (non-prime dependent on subset of composite key)', '3NF = No transitive dependency', 'BCNF = For X -> Y, X must be a Super Key']
      },
      {
        title: 'Transactions and ACID Properties',
        slug: 'transactions-acid-properties',
        order: 6,
        estimatedMinutes: 45,
        summary: 'Transaction states, Atomicity, Consistency, Isolation, Durability, write-ahead logging (WAL), and commit/rollback.',
        definition: 'A database transaction is a logical unit of work comprising one or more database operations that must execute with complete integrity.',
        detailedExplanation: 'Transactions adhere to the ACID properties: Atomicity (all operations succeed or all roll back; "all or nothing", implemented via Write-Ahead Logging/undo logs), Consistency (database transitions from one valid state satisfying all schema constraints to another), Isolation (concurrent transactions execute without interfering with one another, preventing dirty reads and non-repeatable reads), Durability (once committed, changes persist permanently even after hardware crashes or power failures, via redo logs / WAL). Transaction states include: Active, Partially Committed, Committed, Failed, and Aborted.',
        typesAndClassifications: ['ACID Properties', 'Transaction States (Active, Partially Committed, Committed, Failed, Aborted)', 'Flat Transactions', 'Nested / Distributed Transactions (2PC)'],
        importantConcepts: ['ACID guarantees and implementation mechanisms', 'Write-Ahead Logging (WAL) protocol: log records written to disk before dirty data pages', 'Checkpointing in DBMS recovery'],
        practicalApplications: ['Bank fund transfers (deduct from sender and add to receiver atomically)', 'Flight booking seat reservation systems'],
        codeExamples: [
          {
            language: 'sql',
            title: 'TransactionBlock.sql',
            code: `BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 500 WHERE id = 101;
UPDATE accounts SET balance = balance + 500 WHERE id = 202;
-- Verify constraints
IF (SELECT balance FROM accounts WHERE id = 101) < 0 THEN
    ROLLBACK; -- Abort and restore previous consistent state
ELSE
    COMMIT; -- Permanently persist changes
END IF;`,
            explanation: 'Atomic bank transfer: both accounts update together or both roll back.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'Commit O(1) sequential log append to disk', spaceComplexity: 'WAL log segment storage', explanation: 'Sequential disk write to log is fast.' },
        commonMistakes: ['Assuming committed transactions can be lost upon sudden power loss (Durability guarantees persistence via WAL flush)'],
        interviewQuestions: [{ question: 'How does a database engine implement Atomicity and Durability?', answer: 'Via Write-Ahead Logging (WAL). To ensure Atomicity, the Undo Log tracks original values of modified data; if a transaction aborts, undo logs revert dirty writes. To ensure Durability, the Redo Log is flushed to non-volatile disk before acknowledging commit; on crash recovery, unwritten dirty buffer pages are redone from the log.', tips: 'Mention Undo Log for Atomicity and Redo Log for Durability.' }],
        examQuestions: [{ question: 'Explain ACID properties in detail. How does DBMS maintain consistency and durability?', marks: 10, solutionGuide: 'Define A, C, I, D. Detail shadow paging / WAL for Atomicity and Redo logging for Durability.' }],
        practiceExercises: ['Write a simulated banking transaction in SQL with savepoints and error rollback.'],
        revisionNotes: ['Atomicity = All or Nothing (Undo log)', 'Consistency = Invariants preserved', 'Isolation = No interference (Concurrency control)', 'Durability = Changes survive crashes (Redo log / WAL)']
      },
      {
        title: 'Concurrency Control and Indexing',
        slug: 'concurrency-control-indexing',
        order: 7,
        estimatedMinutes: 50,
        summary: 'Schedules (serial, conflict serializable), Two-Phase Locking (2PL), deadlock prevention, B-Tree and B+ Tree indexing, and query execution plans.',
        definition: 'Concurrency control coordinates simultaneous transaction execution without conflicts, while indexing creates auxiliary data structures to accelerate data retrieval.',
        detailedExplanation: 'Concurrency anomalies include: Dirty Read (reading uncommitted data), Non-repeatable Read (rereading row sees different values), and Phantom Read (rereading range sees newly inserted rows). Conflict Serializability checks if a schedule is equivalent to a serial schedule by building a Precedence Graph (cycle indicates non-serializable). Two-Phase Locking (2PL: Growing Phase where locks are acquired, Shrinking Phase where locks are released) guarantees conflict serializability; Strict 2PL holds exclusive locks until commit. Indexing uses B+ Trees where all data records reside in leaf nodes linked sequentially, enabling both O(log n) point lookups and high-speed range scans.',
        typesAndClassifications: ['Isolation Levels (Read Uncommitted, Read Committed, Repeatable Read, Serializable)', 'Locking Protocols (Shared vs Exclusive locks, 2PL, Strict 2PL)', 'Indexes (Primary/Clustered, Secondary/Non-clustered, B+ Tree, Hash Index)'],
        importantConcepts: ['Conflict Serializability & Precedence Graph (Serialization Graph)', 'Two-Phase Locking (2PL) Growing and Shrinking phases', 'B+ Tree structure: Balanced search tree with linked leaf nodes', 'Clustered index (determines physical row order) vs Non-clustered index'],
        practicalApplications: ['High-throughput transaction processing in payment gateways', 'Speeding up SQL queries from minutes to milliseconds via targeted composite indexing'],
        codeExamples: [
          {
            language: 'sql',
            title: 'IndexCreation.sql',
            code: `-- Composite Index for multi-column query acceleration
CREATE INDEX idx_orders_customer_date 
ON orders (customer_id, order_date DESC);
-- Analyze query plan
EXPLAIN ANALYZE 
SELECT * FROM orders 
WHERE customer_id = 42 
ORDER BY order_date DESC;`,
            explanation: 'Uses composite index to satisfy both filter and sorting without file sort.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'B+ Tree Search/Insert/Delete: O(log_B N) where B is fanout (~100-500)', spaceComplexity: 'Index overhead ~10-20% of table size', explanation: 'Shallow tree depth (3-4 levels) minimizes disk I/O.' },
        commonMistakes: ['Over-indexing tables, which significantly degrades INSERT, UPDATE, and DELETE performance due to index maintenance'],
        interviewQuestions: [{ question: 'Why are B+ Trees preferred over Binary Search Trees or B-Trees for database indexing?', answer: '1. Higher fanout (branching factor) means shallow tree depth (3-4 levels for millions of rows), drastically minimizing disk block I/O. 2. Data records are exclusively stored in leaf nodes, leaving internal nodes purely for routing keys. 3. Leaf nodes are linked as a doubly-linked list, enabling efficient sequential range scans.', tips: 'Highlight high fanout minimizing disk I/O and linked leaves for range queries.' }],
        examQuestions: [{ question: 'What is Conflict Serializability? Test whether schedule S is conflict serializable: r1(x), r2(x), w1(x), r1(y), w2(x), c1, c2.', marks: 10, solutionGuide: 'Draw Precedence Graph with edges for conflicting read/write pairs. Check for cycles.' }],
        practiceExercises: ['Trace insertion of keys into a B+ Tree with order M=4 and show node splits.'],
        revisionNotes: ['Strict 2PL prevents cascading rollbacks', 'B+ Trees have high fanout and linked leaf nodes for range scans', 'Clustered index physically sorts rows; only 1 per table']
      }
    ]
  },

  // 4. OPERATING SYSTEMS
  {
    slug: 'operating-systems',
    name: 'Operating Systems',
    description: 'Process management, thread scheduling, synchronization primitives, deadlocks, virtual memory, paging, file systems, and disk scheduling algorithms.',
    category: 'Computer Science',
    icon: 'Cpu',
    order: 4,
    topics: [
      {
        title: 'Operating System Fundamentals and System Calls',
        slug: 'os-fundamentals-system-calls',
        order: 1,
        estimatedMinutes: 35,
        summary: 'Kernel vs User space, dual-mode operation, Interrupts, System Call interface, and monolithic vs microkernel architecture.',
        definition: 'An Operating System is system software that acts as an intermediary between computer hardware and the user, managing hardware resources and providing a platform for application execution.',
        detailedExplanation: 'Modern CPUs implement Dual-Mode Operation: User Mode (restricted privileges) and Kernel Mode (ring 0, full hardware access). Applications transition from user space to kernel space via System Calls (e.g., read, write, fork, exec) triggered by software interrupts or CPU instructions (sysenter/syscall). The interrupt vector table dispatches system call handlers. Monolithic kernels (Linux) execute all core services in kernel space for maximum performance; Microkernels (Mach, seL4) keep only minimal IPC and memory management in kernel space, running file systems and device drivers as user-space servers for enhanced fault tolerance.',
        typesAndClassifications: ['Monolithic Kernel', 'Microkernel', 'Hybrid Kernel', 'Real-Time Operating System (RTOS)'],
        importantConcepts: ['Dual-mode CPU operation (Ring 3 user vs Ring 0 kernel)', 'Context Switching and Mode Switching', 'System Call lifecycle', 'Hardware interrupts vs Software traps'],
        practicalApplications: ['Device driver interactions', 'Container virtualization (Docker namespaces and cgroups)', 'Embedded hardware firmware'],
        codeExamples: [
          {
            language: 'c',
            title: 'ForkSystemCall.c',
            code: `#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main() {
    pid_t pid = fork(); // Creates child process
    if (pid < 0) {
        perror("Fork failed");
    } else if (pid == 0) {
        printf("Child process PID: %d\\n", getpid());
    } else {
        wait(NULL); // Parent waits for child termination
        printf("Parent process completed.\\n");
    }
    return 0;
}`,
            explanation: 'fork() duplicates caller process; child receives return value 0, parent receives child PID.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'System call overhead ~100-300 nanoseconds', spaceComplexity: 'Kernel stack allocation per thread', explanation: 'Hardware mode switch and register saving overhead.' },
        commonMistakes: ['Confusing mode switch (switching user to kernel mode for same process) with context switch (saving process state and loading another process)'],
        interviewQuestions: [{ question: 'What happens during a System Call at the CPU hardware level?', answer: 'The user program executes a syscall/trap instruction, causing the CPU to switch from user mode to kernel mode. Hardware saves program counter and registers onto the kernel stack, consults the Interrupt Descriptor Table (IDT), executes the kernel handler, places results in return registers, and returns to user space via sysret/iret.', tips: 'Mention privilege level change and register saving.' }],
        examQuestions: [{ question: 'Explain Monolithic vs Microkernel architectures with advantages and disadvantages.', marks: 8, solutionGuide: 'Tabulate performance, crash safety, modularity, and IPC overhead.' }],
        practiceExercises: ['Trace system calls executed by a simple command using strace in Linux.'],
        revisionNotes: ['Dual-mode: User mode (safe) vs Kernel mode (privileged)', 'fork() creates child process; exec() replaces address space', 'Monolithic is faster; Microkernel is more secure/modular']
      },
      {
        title: 'Processes, Threads, and CPU Scheduling',
        slug: 'processes-threads-scheduling',
        order: 2,
        estimatedMinutes: 50,
        summary: 'PCB, Process states, context switching, FCFS, SJF, SRTF, Round Robin, Priority, and Multilevel Feedback Queue.',
        definition: 'A process is an active program in execution containing program code and current activity, while a thread is the smallest schedulable unit of CPU execution within a process.',
        detailedExplanation: 'A process address space contains Text, Data, Heap (dynamic memory), and Stack (local variables, return pointers). The Process Control Block (PCB) stores PID, state, PC, CPU registers, memory limits, and open file descriptors. Process states include New, Ready, Running, Waiting, and Terminated. Threads in the same process share code, data, and heap, but have independent stacks and registers. CPU Scheduling algorithms optimize CPU utilization, throughput, turnaround time, waiting time, and response time: FCFS (non-preemptive, convoy effect), SJF/SRTF (provably optimal average waiting time), Round Robin (time quantum slicing), Priority scheduling, and Multilevel Feedback Queue (MLFQ).',
        typesAndClassifications: ['Process States', 'Threads (User-level threads vs Kernel-level threads)', 'Preemptive vs Non-Preemptive Scheduling', 'Scheduling Algorithms (FCFS, SJF, Round Robin, MLFQ)'],
        importantConcepts: ['Process Control Block (PCB)', 'Context Switch latency and cache invalidation', 'Convoy Effect in FCFS', 'Round Robin time quantum trade-off (too small = excessive context switching; too large = FCFS)'],
        practicalApplications: ['Multi-core CPU task allocation in Linux CFS (Completely Fair Scheduler)', 'Web server worker pools'],
        codeExamples: [
          {
            language: 'text',
            title: 'RoundRobinGantt.txt',
            code: `Processes: P1 (Burst 24ms), P2 (Burst 3ms), P3 (Burst 3ms)
Time Quantum = 4ms

Gantt Chart:
[ P1: 0-4 | P2: 4-7 | P3: 7-10 | P1: 10-14 | P1: 14-18 | P1: 18-22 | P1: 22-26 | P1: 26-30 ]

P2 waiting time: 4 - 0 = 4ms
P3 waiting time: 7 - 0 = 7ms
P1 waiting time: (0) + (10 - 4) = 6ms
Average Waiting Time = (6 + 4 + 7) / 3 = 5.67ms`,
            explanation: 'Demonstrates Round Robin time slicing preventing starvation.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'Scheduling decision: O(1) in Linux CFS using red-black tree leftmost lookup', spaceComplexity: 'O(number of processes) for PCB table', explanation: 'Runqueue maintenance complexity.' },
        commonMistakes: ['Confusing turnaround time (Completion Time - Arrival Time) with waiting time (Turnaround Time - Burst Time)'],
        interviewQuestions: [{ question: 'What is the Convoy Effect in CPU scheduling?', answer: 'The convoy effect occurs in non-preemptive scheduling (like FCFS) when a CPU-bound process with a huge burst time occupies the CPU, forcing numerous I/O-bound processes with short bursts to wait in the ready queue, severely degrading CPU and device utilization.', tips: 'Explain how Round Robin or SRTF mitigates the convoy effect.' }],
        examQuestions: [{ question: 'Calculate Average Turnaround Time and Average Waiting Time for processes using Round Robin (Quantum = 2) and Preemptive SJF.', marks: 10, solutionGuide: 'Draw Gantt charts for both algorithms and tabulate Completion, Turnaround, and Waiting times.' }],
        practiceExercises: ['Simulate FCFS, SJF, and Round Robin algorithms in Java or C.'],
        revisionNotes: ['Turnaround Time = Completion - Arrival', 'Waiting Time = Turnaround - Burst', 'SJF gives minimum average waiting time', 'Round Robin prevents starvation via time quantum']
      },
      {
        title: 'Process Synchronization and Deadlocks',
        slug: 'synchronization-and-deadlocks',
        order: 3,
        estimatedMinutes: 50,
        summary: 'Critical section problem, Peterson\'s solution, Mutex, Semaphores (binary/counting), Classical problems (Dining Philosophers, Readers-Writers), and Banker\'s algorithm.',
        definition: 'Process synchronization coordinates the execution of concurrent processes that share memory or resources to maintain data consistency.',
        detailedExplanation: 'The Critical Section problem requires satisfying three criteria: 1. Mutual Exclusion, 2. Progress, and 3. Bounded Waiting. Synchronization primitives include Mutexes (binary lock with ownership) and Semaphores (integer counters accessed via atomic wait/P and signal/V operations). Classical synchronization problems include Producer-Consumer (bounded buffer), Readers-Writers (starvation trade-offs), and Dining Philosophers. Deadlock occurs when processes are permanently blocked waiting for resources held by each other. Four Coffman conditions for deadlock: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. Banker\'s Algorithm safely evaluates resource allocation requests to ensure the system remains in a safe state.',
        typesAndClassifications: ['Mutex vs Semaphore (Binary vs Counting)', 'Deadlock Handling: Prevention, Avoidance (Banker\'s), Detection & Recovery, Ignorance (Ostrich)'],
        importantConcepts: ['3 Critical Section requirements (Mutual Exclusion, Progress, Bounded Waiting)', 'Race conditions and atomic operations (Test-And-Set, Compare-And-Swap)', 'Four Coffman Deadlock Conditions', 'Banker\'s Algorithm Safe State matrix calculations'],
        practicalApplications: ['Multi-threaded connection pools', 'Database row-level lock managers', 'Operating system driver buffer queues'],
        codeExamples: [
          {
            language: 'java',
            title: 'ProducerConsumerSemaphore.java',
            code: `Semaphore mutex = new Semaphore(1);
Semaphore empty = new Semaphore(CAPACITY);
Semaphore full = new Semaphore(0);

void produce(Item item) throws InterruptedException {
    empty.acquire(); // wait for empty slot
    mutex.acquire(); // enter critical section
    buffer.add(item);
    mutex.release();
    full.release(); // signal consumer
}`,
            explanation: 'Coordinates producer and consumer using counting and binary semaphores.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'Banker\'s algorithm: O(m * n^2) where n is processes and m is resource types', spaceComplexity: 'O(n * m) for Allocation and Need matrices', explanation: 'Safety algorithm verification complexity.' },
        commonMistakes: ['Reversing the order of wait/acquire operations in nested semaphores, causing immediate deadlock'],
        interviewQuestions: [{ question: 'What is the difference between a Mutex and a Semaphore?', answer: 'A Mutex is a locking mechanism with ownership: only the thread that acquired the mutex can release it. A Semaphore is a signaling mechanism with a counter; any thread can signal/release a semaphore. A mutex can be seen as a binary semaphore with ownership semantics.', tips: 'Emphasize ownership and signaling differences.' }],
        examQuestions: [{ question: 'Explain Banker\'s Algorithm for Deadlock Avoidance. Given Allocation, Max, and Available matrices, determine if the system is in a safe state.', marks: 10, solutionGuide: 'Compute Need = Max - Allocation. Trace Work and Finish vectors to find safe execution sequence.' }],
        practiceExercises: ['Implement a solution to the Dining Philosophers problem avoiding deadlock using asymmetric seating or semaphores.'],
        revisionNotes: ['Critical section: Mutual Exclusion, Progress, Bounded Waiting', 'Coffman conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait', 'Banker algorithm ensures system stays in a Safe State']
      },
      {
        title: 'Memory Management and Virtual Memory',
        slug: 'memory-management-virtual-memory',
        order: 4,
        estimatedMinutes: 50,
        summary: 'Paging, Segmentation, TLB, Page Tables, Page Faults, Virtual Memory, and Page Replacement algorithms (FIFO, LRU, Optimal).',
        definition: 'Memory management coordinates computer memory, allocating portions to programs, while Virtual Memory provides the illusion of a large contiguous memory space beyond physical RAM.',
        detailedExplanation: 'Logical addresses generated by the CPU are mapped to physical memory addresses via the Memory Management Unit (MMU). Paging divides logical address space into fixed-size Pages and physical RAM into Frames of equal size, completely eliminating External Fragmentation (though internal fragmentation remains in the last page). The Translation Lookaside Buffer (TLB) is an associative hardware cache for page table entries. In Virtual Memory, Demanding Paging loads pages only when needed; accessing an unmapped page triggers a Page Fault interrupt. Page replacement algorithms replace an in-RAM page when frames are exhausted: FIFO (suffers from Belady\'s Anomaly), Optimal (replaces page not used for longest future time; benchmark only), and LRU (Least Recently Used; optimal practical approximation).',
        typesAndClassifications: ['Paging vs Segmentation', 'Single-level vs Hierarchical / Inverted Page Tables', 'Page Replacement (FIFO, LRU, Optimal, Clock algorithm)', 'Belady\'s Anomaly'],
        importantConcepts: ['Logical vs Physical Address translation', 'Page Table Base Register (PTBR) and TLB hit ratio', 'Page Fault Handling sequence', 'Thrashing: excessive paging activity causing CPU utilization to collapse'],
        practicalApplications: ['Operating system memory overcommitment', 'Isolated sandbox memory address spaces per process', 'Memory-mapped files (mmap)'],
        codeExamples: [
          {
            language: 'text',
            title: 'LruPageReplacement.txt',
            code: `Reference String: 7, 0, 1, 2, 0, 3, 0, 4, 2, 3
Frames: 3

Ref: 7 -> [7, -, -] Page Fault (1)
Ref: 0 -> [7, 0, -] Page Fault (2)
Ref: 1 -> [7, 0, 1] Page Fault (3)
Ref: 2 -> [2, 0, 1] Page Fault (4) (Replaces 7, least recently used)
Ref: 0 -> [2, 0, 1] Hit (0 refreshed)
Ref: 3 -> [2, 0, 3] Page Fault (5) (Replaces 1)
Ref: 0 -> [2, 0, 3] Hit
Ref: 4 -> [4, 0, 3] Page Fault (6) (Replaces 2)
Ref: 2 -> [4, 0, 2] Page Fault (7) (Replaces 3)
Ref: 3 -> [3, 0, 2] Page Fault (8) (Replaces 4)

Total Page Faults = 8`,
            explanation: 'Traces LRU page replacement with 3 frames.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'Effective Access Time: EAT = hit_ratio * (TLB + RAM) + (1 - hit_ratio) * (TLB + 2*RAM)', spaceComplexity: 'Page table overhead ~4MB to few GBs', explanation: 'Multi-level paging saves unused table space.' },
        commonMistakes: ['Confusing Internal Fragmentation (wasted space inside an allocated fixed-size block/page) with External Fragmentation (free memory broken into scattered unusable small holes)'],
        interviewQuestions: [{ question: 'What is Thrashing in Virtual Memory and how can the OS resolve it?', answer: 'Thrashing occurs when a computer\'s virtual memory subsystem is in a constant state of paging, spending more time swapping pages in and out of disk than executing instructions, collapsing CPU utilization. The OS resolves thrashing using the Working Set Model or Page Fault Frequency (PFF) algorithm, swapping out low-priority processes to free memory frames.', tips: 'Mention Working Set Model and Page Fault Frequency.' }],
        examQuestions: [{ question: 'Calculate Effective Memory Access Time (EMAT) if TLB access is 20ns, RAM access is 100ns, and TLB hit ratio is 90%.', marks: 6, solutionGuide: 'EMAT = 0.9 * (20 + 100) + 0.1 * (20 + 100 + 100) = 0.9 * 120 + 0.1 * 220 = 108 + 22 = 130ns.' }],
        practiceExercises: ['Trace FIFO page replacement on reference string 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5 for 3 and 4 frames to demonstrate Belady\'s Anomaly.'],
        revisionNotes: ['Paging eliminates external fragmentation; pages mapped to frames', 'TLB is fast hardware cache for page translations', 'LRU is practical approximation of Optimal algorithm', 'Belady\'s Anomaly: FIFO page faults increase when frames increase']
      }
    ]
  },

  // 5. COMPUTER NETWORKS
  {
    slug: 'computer-networks',
    name: 'Computer Networks',
    description: 'Network architecture, OSI and TCP/IP models, IP addressing, subnetting, routing algorithms, TCP vs UDP, congestion control, DNS, and TLS security.',
    category: 'Computer Science',
    icon: 'Network',
    order: 5,
    topics: [
      {
        title: 'Network Models: OSI vs TCP/IP',
        slug: 'osi-tcp-ip-models',
        order: 1,
        estimatedMinutes: 40,
        summary: '7 layers of OSI, 4 layers of TCP/IP, encapsulation and decapsulation, PDUs, and device mappings.',
        definition: 'Network models provide standardized architectural frameworks that describe how hardware and protocols interoperate to transmit data across interconnected networks.',
        detailedExplanation: 'The OSI (Open Systems Interconnection) reference model defines 7 theoretical layers: Physical (bits, cables, hubs), Data Link (frames, MAC addresses, switches), Network (packets, IP addresses, routers), Transport (segments, port numbers, TCP/UDP), Session (dialog control), Presentation (data formatting, encryption, compression), and Application (HTTP, SMTP, FTP). The practical TCP/IP model condenses these into 4 functional layers: Network Access / Link Layer, Internet Layer, Transport Layer, and Application Layer. Data encapsulation wraps protocol headers (PDU) at each layer on transmission, and decapsulation strips headers upon reception.',
        typesAndClassifications: ['OSI 7-Layer Model', 'TCP/IP 4-Layer Suite', 'Packet Data Units: Bits -> Frames -> Packets -> Segments -> Data'],
        importantConcepts: ['Encapsulation and Decapsulation pipeline', 'Protocols at each layer', 'Network devices: Hubs (L1), Switches (L2), Routers (L3), Gateways (L7)'],
        practicalApplications: ['Network packet debugging using Wireshark', 'Designing protocol stacks and microservice networking'],
        codeExamples: [
          {
            language: 'text',
            title: 'PduEncapsulation.txt',
            code: `Layer 7-5 (Application): Data (e.g., HTTP GET / HTTP/1.1)
           ↓ Encapsulate with TCP Header (Source/Dest Port)
Layer 4 (Transport): Segment [ TCP Header | Data ]
           ↓ Encapsulate with IP Header (Source/Dest IP)
Layer 3 (Network): Packet [ IP Header | TCP Header | Data ]
           ↓ Encapsulate with Ethernet Frame Header & FCS Trailer (MACs)
Layer 2 (Data Link): Frame [ Eth Header | IP Header | TCP Header | Data | CRC ]
           ↓ Modulate into raw bits/voltages
Layer 1 (Physical): Bits [ 101011001011... ]`,
            explanation: 'Visualizes PDU transformation down the protocol stack.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'Header encapsulation O(1) buffer prepending', spaceComplexity: 'MTU limits (e.g. 1500 bytes Ethernet frame)', explanation: 'Hardware NIC handles link layer framing.' },
        commonMistakes: ['Assuming switches inspect IP packets (standard Layer 2 switches only inspect MAC addresses)'],
        interviewQuestions: [{ question: 'What is the difference between the OSI Model and TCP/IP Model?', answer: 'The OSI model is a 7-layer theoretical conceptual model developed by ISO that strictly separates services, interfaces, and protocols. The TCP/IP model is a 4-layer practical protocol suite developed by DoD that powers the global Internet, combining OSI layers 5-7 into the Application layer and layers 1-2 into the Network Access layer.', tips: 'Contrast theoretical OSI vs implemented TCP/IP.' }],
        examQuestions: [{ question: 'Explain the functions of all 7 layers of the OSI reference model with example protocols for each layer.', marks: 10, solutionGuide: 'Detail Physical, Data Link, Network, Transport, Session, Presentation, Application with protocols.' }],
        practiceExercises: ['Capture network packets using Wireshark and inspect Ethernet, IP, TCP, and HTTP headers.'],
        revisionNotes: ['PDU: Bits (L1) -> Frames (L2) -> Packets (L3) -> Segments (L4) -> Data (L5-7)', 'L2 uses MAC addresses; L3 uses IP addresses; L4 uses Port numbers']
      },
      {
        title: 'IP Addressing, Subnetting, and Routing',
        slug: 'ip-addressing-subnetting-routing',
        order: 2,
        estimatedMinutes: 50,
        summary: 'IPv4 vs IPv6, CIDR notation, subnet masks, network and broadcast addresses, VLSM, and routing algorithms (Dijkstra, Distance Vector).',
        definition: 'IP addressing assigns unique logical numerical identifiers to devices on a network, while subnetting divides a large network into smaller, efficient subnetworks.',
        detailedExplanation: 'IPv4 addresses are 32-bit dotted-decimal numbers (e.g. 192.168.1.1). Classless Inter-Domain Routing (CIDR) uses slash notation (e.g. /24) where the prefix denotes the network bits and the remainder denotes host bits. Subnetting calculates Network ID (bitwise AND of IP and Subnet Mask), First Usable Host, Last Usable Host, and Broadcast Address (host bits set to 1). Total usable hosts = 2^(host_bits) - 2. Routing algorithms determine optimal paths for packets: Link-State Routing (OSPF) uses Dijkstra\'s algorithm with complete topology knowledge, while Distance Vector (RIP) uses the Bellman-Ford algorithm based on neighbor exchanges.',
        typesAndClassifications: ['IPv4 (32-bit) vs IPv6 (128-bit)', 'Unicast, Multicast, Broadcast, Anycast', 'Routing: Interior Gateway Protocols (OSPF, RIP) vs Exterior Gateway Protocols (BGP)'],
        importantConcepts: ['CIDR prefix notation', 'Calculating Subnet Mask, Network ID, Broadcast ID, Usable Host Range', 'VLSM (Variable Length Subnet Masking)', 'Dijkstra shortest path algorithm in OSPF'],
        practicalApplications: ['VPC subnet design in AWS and Google Cloud', 'Corporate office network topology planning'],
        codeExamples: [
          {
            language: 'text',
            title: 'SubnetCalculation.txt',
            code: `IP Address: 192.168.10.65 / 26
Subnet Mask: 255.255.255.192 (11111111.11111111.11111111.11000000)
Host bits = 32 - 26 = 6 bits
Subnet Block Size = 2^6 = 64

Subnets:
Subnet 0: 192.168.10.0 to 192.168.10.63
Subnet 1: 192.168.10.64 to 192.168.10.127 (Contains our IP!)

Network Address: 192.168.10.64
First Usable Host: 192.168.10.65
Last Usable Host: 192.168.10.126
Broadcast Address: 192.168.10.127
Total Usable Hosts = 2^6 - 2 = 62`,
            explanation: 'Step-by-step CIDR /26 subnet calculation.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'Routing table lookup: O(1) via Trie / TCAM hardware', spaceComplexity: 'Routing table entry storage', explanation: 'Longest prefix match using TCAM.' },
        commonMistakes: ['Forgetting to subtract 2 (for Network Address and Broadcast Address) when calculating usable hosts'],
        interviewQuestions: [{ question: 'How does a router perform Longest Prefix Match during packet forwarding?', answer: 'When a router receives a packet, it compares the destination IP address against its routing table. If multiple routes match, the router selects the entry with the longest prefix (most specific subnet mask), as it represents the most precise path to the destination.', tips: 'Explain why /28 is chosen over /24.' }],
        examQuestions: [{ question: 'Given IP 172.16.0.0/16, divide it into 4 subnets using VLSM. Determine the subnet mask, network address, and usable range for each.', marks: 10, solutionGuide: 'Borrow 2 bits -> /18. List 4 subnets: .0.0/18, .64.0/18, .128.0/18, .192.0/18.' }],
        practiceExercises: ['Calculate network, broadcast, and host range for 10.20.35.140/27.'],
        revisionNotes: ['CIDR /n: n network bits, 32-n host bits', 'Usable hosts = 2^(32-n) - 2', 'First address is Network ID; Last address is Broadcast ID']
      },
      {
        title: 'Transport Layer: TCP, UDP, and Congestion Control',
        slug: 'transport-tcp-udp-congestion',
        order: 3,
        estimatedMinutes: 50,
        summary: 'TCP 3-Way Handshake, 4-Way Teardown, UDP, Flow Control (Sliding Window), Congestion Control (Slow Start, Congestion Avoidance, Fast Retransmit, Fast Recovery).',
        definition: 'The Transport Layer provides host-to-host process communication services, offering connection-oriented reliable transmission (TCP) or connectionless lightweight transmission (UDP).',
        detailedExplanation: 'TCP provides reliable, ordered, error-checked, flow-controlled byte streams. Connection establishment uses the 3-Way Handshake (SYN -> SYN-ACK -> ACK), and connection termination uses a 4-Way Teardown (FIN -> ACK -> FIN -> ACK). Flow Control uses the Sliding Window protocol where receiver advertises its available buffer space (rwnd). Congestion Control protects the intermediate network using congestion window (cwnd): 1. Slow Start (exponential growth: cwnd doubles every RTT until ssthresh), 2. Congestion Avoidance (linear additive increase: cwnd increases by 1 MSS per RTT), 3. Fast Retransmit (3 duplicate ACKs trigger retransmission without waiting for timeout), and 4. Fast Recovery (multiplicative decrease). UDP provides connectionless, low-overhead datagrams with no ordering, retries, or flow control (ideal for DNS, VoIP, real-time gaming).',
        typesAndClassifications: ['TCP (Connection-oriented, Reliable, Heavy)', 'UDP (Connectionless, Unreliable, Fast)', 'TCP Congestion Control Algorithms (Tahoe, Reno, CUBIC, BBR)'],
        importantConcepts: ['TCP 3-Way Handshake and sequence numbers', 'Sliding Window and flow control (rwnd vs cwnd)', 'Congestion control phases: Slow Start, Congestion Avoidance, Fast Retransmit, Fast Recovery', 'TCP vs UDP trade-offs'],
        practicalApplications: ['Web browsing & file transfers (TCP/HTTP)', 'Video streaming & live voice calls (UDP/WebRTC/QUIC)', 'DNS queries (UDP port 53)'],
        codeExamples: [
          {
            language: 'text',
            title: 'TcpHandshake.txt',
            code: `Client                                 Server
  |                                      |
  | -------- SYN (seq=x) --------------> | (Server listens on port)
  |                                      |
  | <------- SYN-ACK (seq=y, ack=x+1) -- | (Server acknowledges x)
  |                                      |
  | -------- ACK (seq=x+1, ack=y+1) ---> | (Connection ESTABLISHED)
  |                                      |`,
            explanation: 'Diagrams the TCP 3-Way Handshake establishing synchronized sequence numbers.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'Connection setup: 1 RTT; Data transmission: pipelined window', spaceComplexity: 'Socket send and receive buffers (SO_RCVBUF)', explanation: 'Sliding window optimizes bandwidth-delay product.' },
        commonMistakes: ['Confusing Flow Control (protects the receiver\'s buffer) with Congestion Control (protects the network routers and links from saturation)'],
        interviewQuestions: [{ question: 'Explain how TCP Congestion Control handles packet loss via 3 duplicate ACKs vs Timeout.', answer: '3 duplicate ACKs indicate mild network congestion (packets are still reaching receiver, but one was lost); TCP enters Fast Retransmit (retransmits missing packet immediately) and Fast Recovery (halves ssthresh and cwnd, avoiding slow start). A Timeout indicates severe congestion; TCP resets cwnd to 1 MSS and restarts with Slow Start.', tips: 'Contrast mild congestion (Fast Recovery) with severe congestion (Timeout reset to 1 MSS).' }],
        examQuestions: [{ question: 'Describe the TCP 3-way handshake and 4-way termination with sequence diagrams.', marks: 10, solutionGuide: 'Draw ladder diagram for SYN, SYN-ACK, ACK and FIN, ACK, FIN, ACK; explain TIME_WAIT state.' }],
        practiceExercises: ['Calculate maximum throughput of a TCP connection given RTT = 50ms and Window Size = 64KB.'],
        revisionNotes: ['TCP 3-way handshake: SYN -> SYN-ACK -> ACK', 'Flow control uses rwnd (receiver buffer); Congestion control uses cwnd', 'UDP is fast and connectionless; TCP is reliable and ordered']
      },
      {
        title: 'Application Layer Protocols and Network Security',
        slug: 'application-protocols-security',
        order: 4,
        estimatedMinutes: 45,
        summary: 'DNS resolution, HTTP/1.1 vs HTTP/2 vs HTTP/3, TLS/SSL handshake, asymmetric vs symmetric encryption, and firewalls.',
        definition: 'Application Layer protocols define the rules for end-user network communication, while Network Security safeguards transmitted data through cryptographic protocols.',
        detailedExplanation: 'DNS (Domain Name System) translates human-readable hostnames to IP addresses through recursive resolvers, root servers, TLD servers, and authoritative nameservers. HTTP evolution: HTTP/1.1 introduced persistent keep-alive connections but suffered from Head-of-Line (HoL) blocking; HTTP/2 introduced binary framing, multiplexing multiple streams over a single TCP connection, and server push; HTTP/3 replaces TCP with QUIC (UDP-based) to eliminate transport-layer HoL blocking and 0-RTT handshakes. HTTPS encrypts HTTP traffic via TLS (Transport Layer Security). The TLS Handshake uses Asymmetric Encryption (RSA or ECDHE) to authenticate the server and securely agree on a shared Session Key, after which high-speed Symmetric Encryption (AES-GCM) encrypts payload data.',
        typesAndClassifications: ['Application Protocols (HTTP, DNS, SMTP, FTP, SSH)', 'HTTP Versions (HTTP/1.1, HTTP/2, HTTP/3/QUIC)', 'Cryptography (Symmetric AES vs Asymmetric RSA/ECC)', 'Security Tools (Firewalls, IDS/IPS, VPN)'],
        importantConcepts: ['Recursive vs Iterative DNS resolution', 'HTTP/2 multiplexing vs HTTP/3 QUIC over UDP', 'TLS Handshake and digital certificates (CA)', 'Public key cryptography vs Symmetric encryption'],
        practicalApplications: ['Zero Trust enterprise architectures', 'Deploying SSL/TLS certificates with Let\'s Encrypt', 'CDN edge caching'],
        codeExamples: [
          {
            language: 'text',
            title: 'TlsHandshake.txt',
            code: `Client                                 Server
  |                                      |
  | --- ClientHello (TLS ver, cipher) -> |
  |                                      |
  | <-- ServerHello, Certificate, Key -- | (Server sends X.509 cert + ECDHE param)
  |                                      |
  | (Client verifies CA signature)       |
  | --- ClientKeyExchange (ECDHE param)- | (Both derive identical shared Symmetric Key)
  |                                      |
  | <=== Encrypted Application Data ===> | (High-speed AES-GCM symmetric encryption)`,
            explanation: 'Asymmetric exchange generates symmetric session key.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'TLS handshake: 1 RTT (TLS 1.3) or 0-RTT (session resumption)', spaceComplexity: 'Session cache storage', explanation: 'TLS 1.3 combines key exchange into first flight.' },
        commonMistakes: ['Believing asymmetric encryption encrypts entire web session payloads (it only negotiates the symmetric session key)'],
        interviewQuestions: [{ question: 'What happens from a networking perspective when you type https://www.google.com into your browser and press Enter?', answer: '1. Browser checks local DNS cache; if missing, recursive resolver queries Root -> TLD (.com) -> Authoritative DNS. 2. Browser receives IP address and initiates TCP 3-way handshake on port 443. 3. TLS handshake executes: certificate validated, symmetric session key derived. 4. Browser sends HTTP GET request over encrypted tunnel. 5. Server responds with HTML payload; browser parses, fetches assets, and renders page.', tips: 'Walk chronologically through DNS -> TCP -> TLS -> HTTP -> DOM render.' }],
        examQuestions: [{ question: 'Explain how DNS resolution works with a diagram showing root, TLD, and authoritative servers.', marks: 8, solutionGuide: 'Show iterative vs recursive queries, root servers (.), TLD (.com), and domain nameserver.' }],
        practiceExercises: ['Inspect the TLS certificate of a website using openssl s_client -connect google.com:443.'],
        revisionNotes: ['DNS resolves names to IPs over UDP port 53', 'HTTP/2 multiplexes over 1 TCP connection; HTTP/3 uses QUIC over UDP', 'TLS uses asymmetric keys to negotiate symmetric AES session key']
      }
    ]
  },

  // 6. WEB DEVELOPMENT
  {
    slug: 'web-development',
    name: 'Web Development',
    description: 'Modern full-stack engineering: HTML5, modern CSS, JavaScript ES6+, TypeScript, React architecture, REST APIs, Node.js, Express, and secure authentication.',
    category: 'Computer Science',
    icon: 'Globe',
    order: 6,
    topics: [
      {
        title: 'HTML, Modern CSS, and Responsive Design',
        slug: 'html-css-responsive-design',
        order: 1,
        estimatedMinutes: 40,
        summary: 'Semantic HTML5, CSS Box Model, Flexbox, Grid, CSS Variables, Media Queries, and Tailwind utility-first styling.',
        definition: 'HTML structures content on the web semantically, while CSS describes the visual presentation, layout, and responsiveness across varied device screens.',
        detailedExplanation: 'Semantic HTML5 (<header>, <main>, <nav>, <article>, <section>, <footer>) enhances accessibility (ARIA) and search engine indexing. The CSS Box Model comprises Content, Padding, Border, and Margin (box-sizing: border-box ensures padding and borders are included within specified dimensions). Flexbox provides one-dimensional layout control (axes, alignment, distribution), while CSS Grid provides two-dimensional layout control (rows and columns). Responsive design employs fluid layouts, responsive typography (rem, ch), and media queries (min-width mobile-first). Utility-first frameworks like Tailwind CSS eliminate separate CSS files by applying atomic styling classes directly to markup.',
        typesAndClassifications: ['Semantic HTML5 Elements', 'CSS Box Model', 'Flexbox (1D) vs CSS Grid (2D)', 'Responsive Viewports and Media Queries'],
        importantConcepts: ['box-sizing: border-box', 'Flexbox flex-direction, justify-content, align-items', 'CSS Grid grid-template-columns, fr units, gap', 'Mobile-first responsive design philosophy'],
        practicalApplications: ['Accessible web applications adhering to WCAG 2.1 AA standards', 'Modern responsive SaaS landing pages and dashboards'],
        codeExamples: [
          {
            language: 'css',
            title: 'ResponsiveLayout.css',
            code: `.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}
@media (max-width: 640px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}`,
            explanation: 'Fluid CSS Grid with auto-fit and minmax adapting to any viewport width.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'CSSOM tree construction and layout calculation: browser sub-millisecond', spaceComplexity: 'DOM + CSSOM in memory', explanation: 'Browser rendering pipeline: DOM -> CSSOM -> Render Tree -> Layout -> Paint.' },
        commonMistakes: ['Omitting <meta name="viewport" content="width=device-width, initial-scale=1.0"> in HTML header'],
        interviewQuestions: [{ question: 'Explain the CSS Box Model and how box-sizing: border-box changes it.', answer: 'The CSS box model consists of content, padding, border, and margin. In the default content-box model, width and height only apply to the content; adding padding and border expands the total element size. With box-sizing: border-box, padding and border are included within the specified width and height, preventing layout breakage.', tips: 'Contrast content-box vs border-box formulas.' }],
        examQuestions: [{ question: 'Compare Flexbox and CSS Grid layouts. When should each be utilized?', marks: 8, solutionGuide: 'Flexbox is 1D (rows OR columns); Grid is 2D (rows AND columns simultaneously); give layout examples.' }],
        practiceExercises: ['Build a 3-column responsive card layout using CSS Grid with auto-fit.'],
        revisionNotes: ['Always set box-sizing: border-box', 'Flexbox for 1D component layouts; Grid for 2D page layouts', 'Mobile-first uses min-width media queries']
      },
      {
        title: 'JavaScript ES6+ and TypeScript Core',
        slug: 'javascript-es6-typescript',
        order: 2,
        estimatedMinutes: 45,
        summary: 'Closures, Event Loop, Promises, async/await, ES6 modules, TypeScript interfaces, generics, and strict type checking.',
        definition: 'JavaScript is a dynamic, single-threaded, event-driven language powering the web, while TypeScript is a statically typed superset that compiles to JavaScript.',
        detailedExplanation: 'JavaScript runs on a single thread using an Event Loop with a Call Stack, Microtask Queue (Promises, queueMicrotask), and Macrotask Queue (setTimeout, I/O, event listeners). Microtasks always drain completely before the next macrotask executes. Closures occur when an inner function retains access to its outer lexical scope variables even after the outer function has returned. TypeScript brings compile-time type safety with static type inference, interfaces, type aliases, union/intersection types, generics, and strict null checking, eliminating entire classes of runtime errors (like undefined is not a function).',
        typesAndClassifications: ['Primitive types vs Reference Objects', 'Microtasks vs Macrotasks in Event Loop', 'TypeScript Interfaces vs Type Aliases', 'Generics and Utility Types (Partial, Pick, Omit)'],
        importantConcepts: ['Event Loop lifecycle: Call Stack -> Microtask Queue -> Macrotask Queue -> Render', 'Lexical Scoping and Closures', 'Promises and async/await syntax', 'TypeScript compile-time erasure and interfaces'],
        practicalApplications: ['Building scalable frontend architectures and Node.js microservices', 'Type-safe API contract sharing between client and server'],
        codeExamples: [
          {
            language: 'typescript',
            title: 'TypeScriptGenerics.ts',
            code: `interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  const res = await fetch(url);
  const data: T = await res.json();
  return { success: res.ok, data };
}`,
            explanation: 'Type-safe generic HTTP fetch utility returning strongly-typed response.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'TypeScript type checking at compile time O(N); Zero runtime overhead', spaceComplexity: 'Zero runtime overhead (types are erased)', explanation: 'Compiles down to plain JavaScript.' },
        commonMistakes: ['Misunderstanding Event Loop execution order between Promise.then() and setTimeout()'],
        interviewQuestions: [{ question: 'Explain how the JavaScript Event Loop handles Microtasks versus Macrotasks.', answer: 'The call stack executes synchronous code. When it empties, the Event Loop checks the Microtask Queue (Promise callbacks, MutationObserver). ALL microtasks are executed until the queue is completely empty. Only then does the Event Loop pick ONE macrotask (setTimeout, setInterval), after which it again empties the microtask queue before rendering.', tips: 'Highlight that microtasks preempt macrotasks and run to completion.' }],
        examQuestions: [{ question: 'What is a Closure in JavaScript? Write code demonstrating data privacy using closures.', marks: 8, solutionGuide: 'Define lexical scoping; show factory function creating private counter with increment/getValue methods.' }],
        practiceExercises: ['Write an async function with retry logic and exponential backoff using Promises.'],
        revisionNotes: ['Event Loop: Call Stack -> All Microtasks -> One Macrotask -> Re-render', 'Closure = function bundled with lexical environment', 'TypeScript types are erased at compile time']
      },
      {
        title: 'React Architecture and State Management',
        slug: 'react-architecture-state',
        order: 3,
        estimatedMinutes: 50,
        summary: 'Virtual DOM, Reconciliation, Fiber, Hooks (useState, useEffect, useMemo, useCallback, useRef), Context API, and component lifecycles.',
        definition: 'React is a declarative, component-based JavaScript library for building user interfaces using a virtual DOM and unidirectional data flow.',
        detailedExplanation: 'React represents the UI as a tree of Virtual DOM nodes. When state changes, React creates a new VDOM tree and executes Reconciliation (React Fiber diffing algorithm) to calculate minimal real DOM mutations. Hooks provide functional components with state and lifecycle capabilities: useState manages local state; useEffect handles side-effects (subscriptions, data fetching, DOM changes); useMemo caches expensive computation results; useCallback memoizes function references to prevent child re-renders; useRef maintains a mutable reference that does not trigger re-renders. Context API provides global state propagation across the component tree without prop drilling.',
        typesAndClassifications: ['Functional Components with Hooks', 'Custom Hooks', 'Global State (Context API, Zustand, Redux)', 'Controlled vs Uncontrolled Form Components'],
        importantConcepts: ['Unidirectional Data Flow', 'Virtual DOM and Fiber reconciliation', 'Rules of Hooks (call only at top level, never inside loops/conditions)', 'Dependency arrays in useEffect and useCallback'],
        practicalApplications: ['Single Page Applications (SPAs)', 'Interactive educational dashboards with real-time UI updates'],
        codeExamples: [
          {
            language: 'tsx',
            title: 'CustomHook.tsx',
            code: `import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler); // Cleanup on rapid updates
  }, [value, delay]);
  return debouncedValue;
}`,
            explanation: 'Reusable custom hook debouncing rapid state updates (e.g. search input).'
          }
        ],
        complexityAnalysis: { timeComplexity: 'Virtual DOM Diffing: O(n) heuristic algorithm (heuristics: key prop + component type)', spaceComplexity: 'VDOM tree memory', explanation: 'React Fiber allows interruptible asynchronous rendering.' },
        commonMistakes: ['Omitting variables from the useEffect dependency array or creating infinite loops by updating a state dependency inside effect'],
        interviewQuestions: [{ question: 'Why does React require keys in lists and what happens if you use array indexes as keys?', answer: 'React uses the "key" prop during reconciliation to identify which items have changed, been added, or been removed. Using array indexes breaks when items are reordered, filtered, or inserted at the beginning, causing React to mismatch component state with DOM elements and leading to subtle UI bugs.', tips: 'Explain how keys optimize reconciliation diffing.' }],
        examQuestions: [{ question: 'Explain the lifecycle of a React functional component using useEffect hook.', marks: 8, solutionGuide: 'Show mounting (empty deps), updating (state/prop deps), and unmounting (cleanup return function).' }],
        practiceExercises: ['Create a complete Todo application with filtering, local storage persistence, and custom hooks.'],
        revisionNotes: ['Virtual DOM: diffs VDOM to minimize expensive real DOM writes', 'useEffect cleanup runs before re-running effect and on unmount', 'Keys must be stable and unique across sibling elements']
      },
      {
        title: 'Backend APIs: Node.js, Express, and Security',
        slug: 'nodejs-express-apis-security',
        order: 4,
        estimatedMinutes: 50,
        summary: 'RESTful architecture, Express middleware pipeline, Zod validation, JWT authentication, bcrypt hashing, Helmet, and Rate Limiting.',
        definition: 'Backend API engineering involves designing robust HTTP services that handle business logic, authenticate users, validate input, and interact with databases securely.',
        detailedExplanation: 'REST (Representational State Transfer) structures endpoints around resources using standard HTTP verbs (GET, POST, PUT, PATCH, DELETE) and status codes (200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Error). Express.js processes requests through a linear Middleware Pipeline (logging, body parsing, auth verification, validation, controllers, error handlers). Security best practices mandate: 1. Password hashing with bcrypt (salt rounds >= 10), 2. Stateless JWT authentication with expiration, 3. Input validation via Zod schemas, 4. Security headers with Helmet (CSP, HSTS, X-Frame-Options), 5. Rate limiting with express-rate-limit to prevent brute force attacks, and 6. Centralized error handling that prevents leaking stack traces.',
        typesAndClassifications: ['RESTful Web Services', 'Express Middleware (Application, Router, Error-handling)', 'JWT Authentication & Refresh Token Rotation', 'Security Mitigations (OWASP Top 10)'],
        importantConcepts: ['Middleware next() function chaining', 'Stateless JWT tokens vs Server Sessions', 'bcrypt salt and work factor', 'Input sanitization and schema validation'],
        practicalApplications: ['Secure user account authentication services', 'Enterprise API gateways', 'Microservices communication layer'],
        codeExamples: [
          {
            language: 'typescript',
            title: 'ExpressAuthMiddleware.ts',
            code: `import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;
    next(); // Pass to next handler
  } catch (err) {
    return res.status(403).json({ error: 'Forbidden: Invalid or expired token' });
  }
}`,
            explanation: 'Express middleware verifying JWT token and attaching user to request.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'JWT verification O(1); bcrypt hash computation O(2^cost_factor) intentionally CPU-intensive', spaceComplexity: 'O(1) stateless memory', explanation: 'bcrypt cost factor delays brute-force attacks.' },
        commonMistakes: ['Storing plain text passwords in the database', 'Returning internal database error messages or stack traces to clients in production'],
        interviewQuestions: [{ question: 'What is a JSON Web Token (JWT) and what are its three parts?', answer: 'A JWT is a compact, URL-safe means of representing claims to be transferred between two parties. It consists of three parts separated by dots: 1. Header (algorithm and token type), 2. Payload (claims such as user ID and expiration), and 3. Signature (HMACSHA256 of base64UrlEncode(header) + "." + base64UrlEncode(payload) using a secret key).', tips: 'Emphasize that payload is encoded, NOT encrypted (never put secrets in JWT).' }],
        examQuestions: [{ question: 'Design a RESTful API for a Student Course Registration system including endpoints, HTTP methods, status codes, and security.', marks: 10, solutionGuide: 'Define /api/students, /api/courses, /api/enrollments with GET, POST, DELETE, status codes, and JWT auth.' }],
        practiceExercises: ['Implement an Express authentication router with register, login, and profile using Zod and bcrypt.'],
        revisionNotes: ['REST: standard HTTP methods and resource-oriented URLs', 'Never store plaintext passwords; use bcrypt with salt rounds >= 10', 'JWT is signed, not encrypted; verify on every protected route']
      }
    ]
  },

  // 7. SOFTWARE ENGINEERING
  {
    slug: 'software-engineering',
    name: 'Software Engineering',
    description: 'Software development lifecycle, Agile, Scrum, Requirements engineering, UML modeling, testing strategies, design patterns, and CI/CD pipelines.',
    category: 'Computer Science',
    icon: 'Layers',
    order: 7,
    topics: [
      {
        title: 'Software Development Life Cycle and Agile Methodologies',
        slug: 'sdlc-and-agile',
        order: 1,
        estimatedMinutes: 40,
        summary: 'SDLC phases, Waterfall vs Agile, Scrum framework (roles, events, artifacts), Kanban, and extreme programming.',
        definition: 'Software Engineering is the systematic application of engineering approaches to the development, operation, and maintenance of software systems.',
        detailedExplanation: 'The Software Development Life Cycle (SDLC) encompasses: Requirements Analysis, System Design, Implementation, Testing, Deployment, and Maintenance. The traditional Waterfall model executes these phases sequentially (inflexible to changing requirements). Agile methodologies prioritize iterative development, working software, customer collaboration, and rapid adaptation to change. Scrum is the most prevalent Agile framework, operating in fixed-length timeboxes called Sprints (1-4 weeks). Scrum roles: Product Owner (manages product backlog), Scrum Master (removes impediments and coaches team), and Developers. Scrum events: Sprint Planning, Daily Scrum (15 min standup), Sprint Review, and Sprint Retrospective. Scrum artifacts: Product Backlog, Sprint Backlog, and Increment (Definition of Done).',
        typesAndClassifications: ['Sequential Models (Waterfall, V-Model)', 'Iterative/Agile Models (Scrum, Kanban, XP)', 'Hybrid Models (Spiral, DevOps)'],
        importantConcepts: ['Agile Manifesto 4 Core Values and 12 Principles', 'Scrum Roles, Events, and Artifacts', 'Burn-down and Velocity metrics', 'Kanban WIP (Work-In-Progress) limits'],
        practicalApplications: ['Managing sprint deliverables in modern software teams (Jira / Linear)', 'Continuous customer feedback integration'],
        codeExamples: [
          {
            language: 'text',
            title: 'UserStoryFormat.txt',
            code: `User Story Template:
As a [user persona / student],
I want to [perform an action / take timed quizzes],
So that [achieve a business value / I can assess my exam readiness].

Acceptance Criteria (Gherkin syntax):
Given I am an authenticated student on the quiz page
When I click "Start Quiz" with a 10-minute timer
Then the countdown begins and answers are submitted automatically at 0:00.`,
            explanation: 'Standard Agile User Story and BDD Acceptance Criteria format.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'Sprint cadence 2-week iterations', spaceComplexity: 'Backlog sizing using Fibonacci story points', explanation: 'Velocity stabilizes across sprints.' },
        commonMistakes: ['Treating Daily Scrum as a status report to management rather than a collaborative planning sync for developers'],
        interviewQuestions: [{ question: 'What is the difference between Scrum and Kanban in Agile project management?', answer: 'Scrum uses fixed-length iterations (sprints), predefined roles (Product Owner, Scrum Master), and set ceremonies (Planning, Daily Scrum, Retro). Kanban is continuous flow with no mandated sprint deadlines or fixed roles, focusing on visualizing work on a board and strictly limiting Work In Progress (WIP) at each column to maximize throughput.', tips: 'Contrast fixed timebox (Scrum) vs continuous flow with WIP limits (Kanban).' }],
        examQuestions: [{ question: 'Explain the phases of the Waterfall model and explain why Agile is preferred for modern projects.', marks: 10, solutionGuide: 'Detail Waterfall stages and risks (late testing, no feedback); explain Agile iterative values.' }],
        practiceExercises: ['Write 3 User Stories with acceptance criteria for an online learning platform.'],
        revisionNotes: ['SDLC: Requirements -> Design -> Coding -> Testing -> Deployment -> Maintenance', 'Scrum: Product Owner, Scrum Master, Dev Team', 'Scrum ceremonies: Planning, Daily Standup, Review, Retrospective']
      },
      {
        title: 'Design Patterns and Architectural Principles',
        slug: 'design-patterns-architecture',
        order: 2,
        estimatedMinutes: 50,
        summary: 'SOLID principles, Creational (Singleton, Factory, Builder), Structural (Adapter, Decorator, Facade), and Behavioral (Observer, Strategy).',
        definition: 'Design patterns are repeatable, battle-tested solutions to commonly occurring software design problems within a given context.',
        detailedExplanation: 'The SOLID principles ensure maintainable, flexible code: Single Responsibility (one reason to change), Open/Closed (open for extension, closed for modification), Liskov Substitution (subtypes must be substitutable for base types), Interface Segregation (small client-specific interfaces), and Dependency Inversion (depend on abstractions, not concretions). Gang of Four (GoF) patterns are categorized into: 1. Creational (Singleton: single instance; Factory Method: delegates instantiation to subclasses; Builder: constructs complex objects step-by-step), 2. Structural (Adapter: bridges incompatible interfaces; Decorator: dynamically adds behavior; Facade: provides simplified interface to complex subsystem), 3. Behavioral (Observer: one-to-many event notification; Strategy: encapsulates interchangeable algorithms).',
        typesAndClassifications: ['SOLID Principles', 'Creational Patterns', 'Structural Patterns', 'Behavioral Patterns'],
        importantConcepts: ['SOLID Principles application', 'Singleton double-checked locking thread safety', 'Builder pattern for complex objects with many parameters', 'Strategy pattern eliminating long switch statements', 'Observer pattern for reactive events'],
        practicalApplications: ['Spring Framework Dependency Injection (Inversion of Control)', 'UI Event listeners (Observer)', 'Payment processor pluggability (Strategy)'],
        codeExamples: [
          {
            language: 'java',
            title: 'StrategyPattern.java',
            code: `// Strategy Interface
interface PaymentStrategy {
    void pay(double amount);
}
class CreditCardPayment implements PaymentStrategy {
    public void pay(double amount) { System.out.println("Paid $" + amount + " via Credit Card"); }
}
class PayPalPayment implements PaymentStrategy {
    public void pay(double amount) { System.out.println("Paid $" + amount + " via PayPal"); }
}
// Context
class ShoppingCart {
    private PaymentStrategy strategy;
    public void setPaymentStrategy(PaymentStrategy s) { this.strategy = s; }
    public void checkout(double amount) { strategy.pay(amount); }
}`,
            explanation: 'Strategy pattern allows swapping payment algorithms at runtime cleanly.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'Delegation O(1) method call', spaceComplexity: 'O(1) extra strategy instance', explanation: 'Decouples algorithm from calling context.' },
        commonMistakes: ['Overusing Singleton pattern, turning it into a hidden global state that makes unit testing difficult'],
        interviewQuestions: [{ question: 'Explain the Open/Closed Principle (OCP) and give a code example of how to follow it.', answer: 'The Open/Closed Principle states that software entities should be open for extension, but closed for modification. We achieve this through interfaces and polymorphism (like Strategy or Decorator): adding a new feature means adding a new class implementing the interface, rather than modifying existing tested classes with new if/else branches.', tips: 'Contrast adding new subclasses vs editing existing switch statements.' }],
        examQuestions: [{ question: 'Explain all 5 SOLID principles with real-world software examples and code snippets.', marks: 10, solutionGuide: 'Dedicate one clear section and code example each to S, O, L, I, and D.' }],
        practiceExercises: ['Implement the Builder pattern for a Computer configuration class with optional components.'],
        revisionNotes: ['SOLID: Single responsibility, Open/closed, Liskov substitution, Interface segregation, Dependency inversion', 'Creational: Singleton, Factory, Builder', 'Behavioral: Strategy, Observer']
      },
      {
        title: 'Software Testing, Quality Assurance, and CI/CD',
        slug: 'testing-qa-cicd',
        order: 3,
        estimatedMinutes: 45,
        summary: 'Testing pyramid (Unit, Integration, E2E), TDD, Mocking, Black-box vs White-box testing, Code Coverage, and CI/CD automation.',
        definition: 'Software testing verifies that software behaves as specified and identifies defects, while CI/CD automates integration, testing, and deployment to production.',
        detailedExplanation: 'The Testing Pyramid advocates for a broad base of fast, isolated Unit Tests (testing single functions with mocks), a middle tier of Integration Tests (testing interaction between components like database or API), and a narrow top tier of End-to-End (E2E) Tests (simulating actual user browser journeys). Test-Driven Development (TDD) follows the Red-Green-Refactor cycle: write failing test (Red), write minimal code to pass (Green), clean up code (Refactor). Testing techniques include Black-box (Equivalence Partitioning, Boundary Value Analysis) and White-box (Statement, Branch, Path Coverage). Continuous Integration (CI) automatically builds and tests code on every commit; Continuous Deployment (CD) automatically releases passing builds to staging/production environments.',
        typesAndClassifications: ['Unit Testing', 'Integration Testing', 'End-to-End Testing (E2E)', 'Black-Box vs White-Box Testing', 'Continuous Integration / Continuous Delivery (CI/CD)'],
        importantConcepts: ['Testing Pyramid trade-offs (Speed, Cost, Isolation vs Realism)', 'TDD Red-Green-Refactor lifecycle', 'Boundary Value Analysis (BVA)', 'CI/CD pipeline stages: Lint -> Build -> Test -> Security Scan -> Deploy'],
        practicalApplications: ['Automated GitHub Actions pipelines preventing broken builds in production', 'Preventing regression bugs in enterprise codebases'],
        codeExamples: [
          {
            language: 'typescript',
            title: 'UnitTest.test.ts',
            code: `import { describe, it, expect } from 'vitest';

function calculateStudyStreak(lastActive: string, today: string, currentStreak: number): number {
  const diffDays = Math.floor((new Date(today).getTime() - new Date(lastActive).getTime()) / (1000 * 3600 * 24));
  if (diffDays === 0) return currentStreak;
  if (diffDays === 1) return currentStreak + 1;
  return 1; // Streak reset
}

describe('calculateStudyStreak', () => {
  it('increments streak when consecutive day', () => {
    expect(calculateStudyStreak('2026-10-09', '2026-10-10', 4)).toBe(5);
  });
  it('resets streak to 1 when gap exceeds 1 day', () => {
    expect(calculateStudyStreak('2026-10-05', '2026-10-10', 4)).toBe(1);
  });
});`,
            explanation: 'Unit tests verifying streak logic against edge cases.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'Unit tests run in milliseconds; E2E tests run in minutes', spaceComplexity: 'Ephemeral test container runners', explanation: 'Unit tests should have zero external network dependencies.' },
        commonMistakes: ['Inverting the test pyramid (writing excessive fragile E2E tests with few unit tests, resulting in slow and flaky test suites)'],
        interviewQuestions: [{ question: 'What is the difference between Continuous Delivery and Continuous Deployment?', answer: 'In Continuous Delivery, every code change that passes automated tests is automatically built and packaged into a deployable artifact, ready for production release at any time with a manual approval click. In Continuous Deployment, every passing build is deployed to production automatically with no human intervention.', tips: 'Highlight the manual approval step in Continuous Delivery vs full automation in Continuous Deployment.' }],
        examQuestions: [{ question: 'Explain Boundary Value Analysis (BVA) and Equivalence Class Partitioning with an example testing an input range 1-100.', marks: 8, solutionGuide: 'Define valid/invalid partitions; select boundary values 0, 1, 2, 99, 100, 101.' }],
        practiceExercises: ['Design a CI/CD GitHub Actions workflow YAML file that runs lint, build, test, and container deployment.'],
        revisionNotes: ['Testing pyramid: Many Unit tests > Moderate Integration > Few E2E tests', 'TDD: Red (failing test) -> Green (pass) -> Refactor', 'Continuous Integration: automate test on push; Continuous Deployment: deploy to prod']
      }
    ]
  },

  // 8. ARTIFICIAL INTELLIGENCE
  {
    slug: 'artificial-intelligence',
    name: 'Artificial Intelligence',
    description: 'Artificial intelligence fundamentals, search algorithms, knowledge representation, machine learning, neural networks, NLP, LLMs, embeddings, and RAG.',
    category: 'Computer Science',
    icon: 'Brain',
    order: 8,
    topics: [
      {
        title: 'AI Fundamentals and Search Algorithms',
        slug: 'ai-fundamentals-search',
        order: 1,
        estimatedMinutes: 45,
        summary: 'Intelligent agents, uninformed search (BFS, DFS, Uniform Cost), informed heuristic search (A*, Greedy Best-First), and adversarial search (Minimax, Alpha-Beta).',
        definition: 'Artificial Intelligence is the branch of computer science dedicated to creating systems capable of performing tasks that typically require human intelligence, such as visual perception, decision-making, and reasoning.',
        detailedExplanation: 'An Intelligent Agent perceives its environment through sensors and acts upon it via actuators (PEAS framework: Performance measure, Environment, Actuators, Sensors). Search algorithms find optimal action sequences from an initial state to a goal state. Uninformed search lacks domain heuristics (BFS is complete and optimal for step cost 1; Uniform Cost Search is optimal for arbitrary costs). Informed search uses a heuristic function h(n) estimating cost to goal. A* search evaluates f(n) = g(n) + h(n), where g(n) is path cost from start and h(n) is heuristic. If h(n) is admissible (never overestimates true cost) and consistent, A* is mathematically guaranteed to find the optimal path. Adversarial search powers two-player zero-sum games (Minimax algorithm with Alpha-Beta pruning to discard irrelevant subtrees).',
        typesAndClassifications: ['Uninformed / Blind Search (BFS, DFS, UCS)', 'Informed / Heuristic Search (Greedy Best-First, A*)', 'Local Search (Hill Climbing, Simulated Annealing)', 'Adversarial Search (Minimax, Alpha-Beta Pruning)'],
        importantConcepts: ['PEAS Model of Intelligent Agents', 'A* Search formula f(n) = g(n) + h(n)', 'Admissible and Consistent Heuristics', 'Alpha-Beta Pruning cutoffs (alpha >= beta)'],
        practicalApplications: ['GPS map route navigation (A* on road networks)', 'Automated game playing engines (Chess, Go)', 'Robotic path planning in obstacle grids'],
        codeExamples: [
          {
            language: 'java',
            title: 'AStarSearch.java',
            code: `// A* Evaluation Function: f(n) = g(n) + h(n)
class Node implements Comparable<Node> {
    int id;
    double gCost; // Cost from start
    double hCost; // Heuristic estimate to goal
    double fCost() { return gCost + hCost; }
    public int compareTo(Node o) {
        return Double.compare(this.fCost(), o.fCost());
    }
}`,
            explanation: 'PriorityQueue orders nodes by lowest fCost = gCost + hCost.'
          }
        ],
        complexityAnalysis: { timeComplexity: 'A* worst case O(b^d) where b is branching factor and d is goal depth', spaceComplexity: 'O(b^d) open list storage in memory', explanation: 'Effective heuristics drastically reduce expanded nodes.' },
        commonMistakes: ['Using an inadmissible heuristic in A* search, which can cause it to return a sub-optimal path'],
        interviewQuestions: [{ question: 'What makes a heuristic admissible in A* search and why is admissibility necessary?', answer: 'A heuristic h(n) is admissible if it never overestimates the true minimum cost to reach the goal state (i.e. h(n) <= h*(n) for all nodes). Admissibility is necessary because an overestimating heuristic could cause A* to overlook the true optimal path in favor of a seemingly shorter alternative, sacrificing optimality.', tips: 'State h(n) <= h*(n) and explain the optimality proof.' }],
        examQuestions: [{ question: 'Explain the A* search algorithm. Prove that A* tree search is optimal if h(n) is admissible.', marks: 10, solutionGuide: 'Define f(n) = g(n) + h(n); prove by contradiction that suboptimal goal G2 cannot be selected before optimal goal G.' }],
        practiceExercises: ['Trace A* search on an 8-puzzle grid using Manhattan Distance heuristic.'],
        revisionNotes: ['A* formula: f(n) = g(n) + h(n)', 'h(n) must be admissible (never overestimate)', 'Alpha-Beta pruning cuts subtrees when alpha >= beta without altering Minimax result']
      },
      {
        title: 'Machine Learning and Deep Neural Networks',
        slug: 'machine-learning-neural-networks',
        order: 2,
        estimatedMinutes: 50,
        summary: 'Supervised vs Unsupervised learning, linear regression, logistic regression, perceptron, backpropagation, activation functions, and regularization.',
        definition: 'Machine Learning is a subset of AI where computer algorithms improve automatically through experience and data without being explicitly programmed.',
        detailedExplanation: 'ML paradigms include: Supervised Learning (labeled data: regression, classification), Unsupervised Learning (unlabeled data: clustering like K-Means, dimensionality reduction like PCA), and Reinforcement Learning (agents learning via rewards and penalties). An Artificial Neural Network (ANN) consists of input, hidden, and output layers of artificial neurons. Each neuron computes a weighted sum of inputs plus bias, passed through a non-linear Activation Function (ReLU, Sigmoid, Softmax, GELU). Training uses Backpropagation: computing the gradient of the Loss function with respect to every weight using the chain rule of calculus, iteratively adjusting weights via Gradient Descent (SGD, Adam). Regularization (Dropout, L1/L2 weight decay) prevents overfitting on training data.',
        typesAndClassifications: ['Supervised Learning', 'Unsupervised Learning', 'Reinforcement Learning', 'Activation Functions (ReLU, Sigmoid, Tanh, Softmax)'],
        importantConcepts: ['Bias-Variance Tradeoff', 'Gradient Descent and Loss Functions (Cross-Entropy, MSE)', 'Backpropagation chain rule', 'Overfitting vs Underfitting and Regularization (Dropout)'],
        practicalApplications: ['Credit risk default prediction', 'Medical image diagnostic classification', 'Autonomous vehicle perception'],
        codeExamples: [
          {
            language: 'python',
            title: 'NeuronCalculation.py',
            code: `import numpy as np

def relu(x):
    return np.maximum(0, x)

# Forward pass of a single dense layer
weights = np.array([[0.2, 0.8], [-0.5, 0.3], [0.9, -0.1]])
biases = np.array([0.1, -0.2])
inputs = np.array([1.5, 2.0, -0.5])

output = relu(np.dot(inputs, weights) + biases)
print("Activated Layer Output:", output)`,
            explanation: 'Computes forward activation: ReLU(W^T * X + b).'
          }
        ],
        complexityAnalysis: { timeComplexity: 'Forward/backward pass O(parameters * batch_size)', spaceComplexity: 'GPU VRAM memory for weights and activation cache', explanation: 'Matrix multiplications parallelized across GPU tensor cores.' },
        commonMistakes: ['Vanishing gradient problem when stacking many deep layers with Sigmoid activations (resolved by ReLU/GELU)'],
        interviewQuestions: [{ question: 'What is the Bias-Variance tradeoff in Machine Learning?', answer: 'Bias is error from erroneous model assumptions (high bias leads to underfitting; model is too simple). Variance is error from sensitivity to small fluctuations in training data (high variance leads to overfitting; model memorizes noise). The goal is finding the optimal balance that minimizes total generalization error on unseen test data.', tips: 'Draw the U-shaped total error curve showing Bias vs Variance.' }],
        examQuestions: [{ question: 'Explain the Backpropagation algorithm in Artificial Neural Networks with mathematical derivations of weight updates.', marks: 10, solutionGuide: 'Derive partial derivatives dLoss/dw using chain rule through activation function and weighted sum.' }],
        practiceExercises: ['Implement a multi-layer perceptron from scratch in Python or TypeScript with forward pass and cross-entropy loss.'],
        revisionNotes: ['Supervised: labeled; Unsupervised: unlabeled; Reinforcement: reward-driven', 'Activation functions add non-linearity (ReLU = max(0, x))', 'Backpropagation uses chain rule to compute gradients for Gradient Descent']
      },
      {
        title: 'Large Language Models, Embeddings, and RAG',
        slug: 'llms-embeddings-rag',
        order: 3,
        estimatedMinutes: 55,
        summary: 'Transformer architecture (Self-Attention), Tokenization, Vector Embeddings, Cosine Similarity, Vector Databases, and Retrieval-Augmented Generation (RAG).',
        definition: 'Large Language Models (LLMs) are deep learning models trained on vast text corpora to generate human-like text, while RAG enhances LLMs by retrieving dynamic, grounded factual data from external documents.',
        detailedExplanation: 'The Transformer architecture (Vaswani et al., 2017) revolutionized NLP by replacing sequential RNNs with parallelized Self-Attention: Attention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V, capturing long-range semantic dependencies regardless of distance. Tokenization splits text into subword units (Byte-Pair Encoding). Vector Embeddings map text into high-dimensional vector spaces (e.g. 768 or 1536 dimensions) where semantically similar texts are placed close together (measured by Cosine Similarity). LLMs suffer from knowledge cutoffs and hallucinations. Retrieval-Augmented Generation (RAG) resolves this through a 5-step pipeline: 1. Ingest document, 2. Chunk text with overlap, 3. Generate vector embeddings, 4. Retrieve top-k relevant chunks via vector similarity search, and 5. Augment LLM prompt with retrieved context to generate factually grounded responses with citations.',
        typesAndClassifications: ['Encoder-only (BERT)', 'Decoder-only (GPT, Gemini)', 'Encoder-Decoder (T5)', 'RAG Pipelines (Standard RAG, HyDE, Multi-hop RAG)'],
        importantConcepts: ['Scaled Dot-Product Self-Attention formula', 'Vector Embeddings and Cosine Similarity metric', 'Chunking strategies (size and overlap trade-offs)', 'Prompt injection defense in RAG (treating retrieved context as untrusted reference material)'],
        practicalApplications: ['Enterprise document question-answering systems (Learning Companion)', 'Semantic code search across GitHub repositories', 'Customer support grounded in real policy manuals'],
        codeExamples: [
          {
            language: 'typescript',
            title: 'CosineSimilarity.ts',
            code: `export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
  return magnitude === 0 ? 0 : dotProduct / magnitude;
}`,
            explanation: 'Calculates cosine similarity between two vector embeddings (-1 to +1).'
          }
        ],
        complexityAnalysis: { timeComplexity: 'Self-Attention: O(sequence_length^2); Vector similarity search: O(N * D) brute force or O(log N) with HNSW index', spaceComplexity: 'O(N * D) vector storage', explanation: 'HNSW graph indexing allows sub-linear approximate nearest neighbor retrieval.' },
        commonMistakes: ['Chunking documents without overlap, which breaks sentences across boundaries and causes loss of context'],
        interviewQuestions: [{ question: 'Explain the end-to-end architecture of a Retrieval-Augmented Generation (RAG) system.', answer: 'A RAG system operates in two phases: 1. Ingestion Phase: Documents are parsed (PDF/text), chunked into overlapping segments (e.g., 500 tokens with 10% overlap), converted into vector embeddings via an embedding model, and indexed in a vector store. 2. Query Phase: A user query is converted into an embedding, the vector store retrieves the top-k most similar chunks using cosine similarity, the system constructs an augmented prompt containing the retrieved passages as reference context with system instructions, and the LLM synthesizes an accurate, grounded answer with page citations.', tips: 'Clearly separate the Ingestion Phase from the Query/Inference Phase.' }],
        examQuestions: [{ question: 'Derive the Scaled Dot-Product Attention equation and explain the role of Queries, Keys, Values, and the scaling factor sqrt(d_k).', marks: 10, solutionGuide: 'Attention(Q,K,V)=softmax(QK^T/sqrt(d_k))V. Explain dot product alignment, scaling preventing vanishing gradients in softmax, and value weighting.' }],
        practiceExercises: ['Build a RAG chunking pipeline with 500-word chunks and 50-word overlap in TypeScript.'],
        revisionNotes: ['Attention(Q, K, V) = softmax(Q K^T / sqrt(d_k)) V', 'Embeddings map text to vectors; similar text has high cosine similarity', 'RAG pipeline: Ingest -> Chunk -> Embed -> Retrieve -> Grounded LLM Response']
      }
    ]
  }
];
