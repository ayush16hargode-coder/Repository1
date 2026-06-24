import type { AppData, StudySession } from '../types';

const iso = (daysAgo: number) => {
  const date = new Date(2026, 5, 24 - daysAgo);
  return date.toISOString().slice(0, 10);
};

const history: StudySession[] = Array.from({ length: 17 }, (_, i) => ({
  id: `history-${i}`,
  languageId: i % 3 === 1 ? 'cpp' : i % 5 === 0 ? 'java' : 'python',
  topicId: i % 3 === 1 ? 'cpp-pointers' : i % 5 === 0 ? 'java-collections' : 'py-oop',
  date: iso(i),
  startTime: i === 0 ? '07:10' : '19:00',
  endTime: i === 0 ? '08:35' : '20:30',
  durationMinutes: i === 0 ? 85 : 65 + ((i * 17) % 76),
  notes: i === 0 ? 'Inheritance patterns feel much clearer now.' : 'Steady practice and notes review.',
  completedItems: i === 0 ? ['Abstract classes', 'Method overriding'] : undefined,
}));

history.unshift(
  { id: 'today-cpp', languageId: 'cpp', topicId: 'cpp-pointers', date: iso(0), startTime: '12:20', endTime: '13:15', durationMinutes: 55, notes: 'Practiced pointer arithmetic.' },
  { id: 'today-py-2', languageId: 'python', topicId: 'py-oop', date: iso(0), startTime: '16:40', endTime: '17:40', durationMinutes: 60, notes: 'Built a small class hierarchy.' },
);

export const seedData: AppData = {
  languages: [
    { id: 'python', name: 'Python', sigil: 'Py', color: '#63e6be', description: 'Automation, data, and elegant systems.' },
    { id: 'cpp', name: 'C++', sigil: 'C+', color: '#70a1ff', description: 'Memory, performance, and foundations.' },
    { id: 'java', name: 'Java', sigil: 'Jv', color: '#b197fc', description: 'Robust applications and architecture.' },
  ],
  topics: [
    { id: 'py-basics', languageId: 'python', name: 'Foundations', description: 'Syntax and the language model', status: 'completed', estimatedHours: 8, actualHours: 9, notes: 'Solid.', order: 0, completedAt: '2026-05-02', summary: 'Variables, expressions, modules, and Pythonic conventions.', resources: ['Python documentation', 'Automate the Boring Stuff'] },
    { id: 'py-types', languageId: 'python', name: 'Data Types', description: 'Collections and mutability', status: 'completed', estimatedHours: 9, actualHours: 8, notes: '', order: 1, completedAt: '2026-05-14', summary: 'Choosing collections based on access patterns and mutability.', resources: ['Fluent Python notes'] },
    { id: 'py-loops', languageId: 'python', name: 'Control Flow', description: 'Iteration and comprehensions', status: 'completed', estimatedHours: 6, actualHours: 7, notes: '', order: 2, completedAt: '2026-05-23', summary: 'Loops, generator expressions, and readable branching.', resources: ['Real Python'] },
    { id: 'py-functions', languageId: 'python', name: 'Functions', description: 'Composition and clean boundaries', status: 'completed', estimatedHours: 10, actualHours: 11, notes: '', order: 3, completedAt: '2026-06-05', summary: 'Arguments, closures, decorators, and function composition.', resources: ['Python documentation'] },
    { id: 'py-oop', languageId: 'python', name: 'Object Craft', description: 'Classes, composition, and inheritance', status: 'in-progress', deadline: '2026-06-30', estimatedHours: 16, actualHours: 9.5, notes: 'Revisit multiple inheritance.', order: 4 },
    { id: 'py-oop-classes', languageId: 'python', parentId: 'py-oop', name: 'Classes & Objects', description: 'State and behavior', status: 'completed', estimatedHours: 4, actualHours: 4.5, notes: '', order: 0, completedAt: '2026-06-19', summary: 'Class construction, instance state, and class behavior.', resources: ['Python docs — Classes'] },
    { id: 'py-oop-inheritance', languageId: 'python', parentId: 'py-oop', name: 'Inheritance', description: 'Polymorphism and MRO', status: 'in-progress', deadline: '2026-06-27', estimatedHours: 5, actualHours: 3, notes: 'Practice MRO.', order: 1 },
    { id: 'py-files', languageId: 'python', name: 'File Handling', description: 'Streams, paths, and persistence', status: 'not-started', deadline: '2026-07-08', estimatedHours: 8, actualHours: 0, notes: '', order: 5 },
    { id: 'py-dsa', languageId: 'python', name: 'Algorithms', description: 'Structures and problem solving', status: 'not-started', estimatedHours: 30, actualHours: 0, notes: '', order: 6 },
    { id: 'py-project', languageId: 'python', name: 'Capstone Project', description: 'Ship a complete Python tool', status: 'not-started', estimatedHours: 24, actualHours: 0, notes: '', order: 7 },
    { id: 'cpp-basics', languageId: 'cpp', name: 'Foundations', description: 'Compilation and syntax', status: 'completed', estimatedHours: 10, actualHours: 12, notes: '', order: 0, completedAt: '2026-05-18', summary: 'Compilation units, types, references, and standard IO.', resources: ['learncpp.com'] },
    { id: 'cpp-memory', languageId: 'cpp', name: 'Memory Model', description: 'Stack, heap, and lifetimes', status: 'completed', estimatedHours: 12, actualHours: 14, notes: '', order: 1, completedAt: '2026-06-11', summary: 'Object lifetime, allocation, RAII, and ownership.', resources: ['A Tour of C++'] },
    { id: 'cpp-pointers', languageId: 'cpp', name: 'Pointers', description: 'Addresses, ownership, and safety', status: 'in-progress', deadline: '2026-07-02', estimatedHours: 14, actualHours: 5, notes: 'More exercises needed.', order: 2 },
    { id: 'cpp-stl', languageId: 'cpp', name: 'The STL', description: 'Containers and algorithms', status: 'not-started', deadline: '2026-07-15', estimatedHours: 18, actualHours: 0, notes: '', order: 3 },
    { id: 'cpp-project', languageId: 'cpp', name: 'Systems Project', description: 'Build a small engine', status: 'not-started', estimatedHours: 30, actualHours: 0, notes: '', order: 4 },
    { id: 'java-basics', languageId: 'java', name: 'Core Java', description: 'The language and runtime', status: 'completed', estimatedHours: 14, actualHours: 16, notes: '', order: 0, completedAt: '2026-04-20', summary: 'JVM model, syntax, classes, and exceptions.', resources: ['dev.java Learn'] },
    { id: 'java-collections', languageId: 'java', name: 'Collections', description: 'Lists, maps, sets, and streams', status: 'in-progress', deadline: '2026-07-12', estimatedHours: 16, actualHours: 6, notes: '', order: 1 },
    { id: 'java-spring', languageId: 'java', name: 'Spring Foundations', description: 'Dependency injection and web apps', status: 'not-started', estimatedHours: 32, actualHours: 0, notes: '', order: 2 },
  ],
  sessions: history,
  revisions: [
    { id: 'rev-1', topicId: 'py-basics', date: '2026-05-10', notes: 'Rebuilt exercises from memory.', nextRevision: '2026-07-01' },
    { id: 'rev-2', topicId: 'py-basics', date: '2026-06-10', notes: 'Quick syntax and modules review.', nextRevision: '2026-07-01' },
    { id: 'rev-3', topicId: 'cpp-basics', date: '2026-06-02', notes: 'Reviewed compile/link stages.', nextRevision: '2026-06-29' },
    { id: 'rev-4', topicId: 'py-types', date: '2026-06-18', notes: 'Collection choice flashcards.', nextRevision: '2026-07-18' },
  ],
  futureGoals: [
    { id: 'goal-1', title: 'Build a portfolio world', category: 'Projects', targetStart: '2026-08-01', priority: 0, description: 'An interactive portfolio with case-study quests.' },
    { id: 'goal-2', title: 'Solve 200 coding challenges', category: 'Challenges', targetStart: '2026-12-01', priority: 1, description: 'Build fluency through thoughtful repetition.' },
    { id: 'goal-3', title: 'Learn Linux deeply', category: 'Skills', targetStart: '2027-03-01', priority: 2, description: 'Shell, networking, services, and system internals.' },
    { id: 'goal-4', title: 'Explore Rust', category: 'Languages', targetStart: '2027-06-01', priority: 3, description: 'Ownership, fearless concurrency, and systems craft.' },
  ],
  achievements: [
    { id: 'ach-1', title: 'First Rune', description: 'Completed your first topic.', icon: 'spark', unlockedAt: '2026-04-20' },
    { id: 'ach-2', title: 'Deep Work', description: 'Invested your first 10 focused hours.', icon: 'gem', unlockedAt: '2026-05-01' },
    { id: 'ach-3', title: 'Memory Keeper', description: 'Completed your first revision.', icon: 'book', unlockedAt: '2026-05-10' },
    { id: 'ach-4', title: 'Unbroken Current', description: 'Reached 14 days of Momentum.', icon: 'wave', unlockedAt: '2026-06-21' },
    { id: 'ach-5', title: 'Realm Complete', description: 'Complete an entire language roadmap.', icon: 'crown' },
    { id: 'ach-6', title: 'Hundred-Hour Sage', description: 'Study one language for 100 hours.', icon: 'star' },
  ],
  activeSession: null,
  preferences: { accent: 'cyan', notifications: true, revisionReminders: true, compactMotion: false },
};
