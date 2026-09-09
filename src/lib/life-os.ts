/**
 * Local demo dataset for the Life Operating System.
 * Kept in one place so modules stay connected (dashboard aggregates all of it)
 * and can later be swapped for real persistence without touching the UI.
 */

export type LifeArea =
  | "Health"
  | "Career"
  | "Finance"
  | "Relationships"
  | "Knowledge"
  | "Leisure"
  | "Travel"
  | "Personal";

export const lifeAreas: LifeArea[] = [
  "Health",
  "Career",
  "Finance",
  "Relationships",
  "Knowledge",
  "Leisure",
  "Travel",
  "Personal",
];

export const user = {
  name: "Murilo Rovatti",
  handle: "murilo",
  initials: "MR",
  memberSince: "March 2025",
  timezone: "São Paulo",
};

export const lifeScore = {
  current: 78,
  delta: 4,
  weekly: [66, 69, 71, 70, 74, 76, 78],
  monthly: [61, 68, 73, 78],
  strengths: ["Habit consistency", "Weekly planning executed", "Goals shipped on time"],
  attention: ["Sleep below 7h on 3 days", "Finance goal untouched for 12 days"],
};

export type Habit = {
  id: string;
  name: string;
  area: LifeArea;
  streak: number;
  best: number;
  consistency: number;
  doneToday: boolean;
  last14: boolean[];
};

const pattern = (seed: number) =>
  Array.from({ length: 14 }, (_, i) => (i * seed) % 5 !== 0 || i % 7 === 3);

export const habits: Habit[] = [
  { id: "h1", name: "Exercise", area: "Health", streak: 12, best: 34, consistency: 86, doneToday: true, last14: pattern(3) },
  { id: "h2", name: "Reading", area: "Knowledge", streak: 21, best: 21, consistency: 92, doneToday: true, last14: pattern(4) },
  { id: "h3", name: "Water 3L", area: "Health", streak: 5, best: 19, consistency: 71, doneToday: false, last14: pattern(2) },
  { id: "h4", name: "Sleep 7h+", area: "Health", streak: 2, best: 28, consistency: 64, doneToday: false, last14: pattern(5) },
  { id: "h5", name: "Meditation", area: "Personal", streak: 9, best: 16, consistency: 78, doneToday: true, last14: pattern(6) },
  { id: "h6", name: "Deep study", area: "Career", streak: 4, best: 11, consistency: 58, doneToday: false, last14: pattern(7) },
];

export type Goal = {
  id: string;
  title: string;
  description: string;
  area: LifeArea;
  priority: "High" | "Medium" | "Low";
  due: string;
  progress: number;
  status: "On track" | "At risk" | "Completed";
  vision: string;
  tasks: { title: string; done: boolean }[];
};

export const goals: Goal[] = [
  {
    id: "g1",
    title: "Run a sub-50min 10K",
    description: "Build an aerobic base with 4 sessions per week and one long run.",
    area: "Health",
    priority: "High",
    due: "Oct 2026",
    progress: 68,
    status: "On track",
    vision: "A body I can rely on for the next 40 years",
    tasks: [
      { title: "Base block — 6 weeks", done: true },
      { title: "Threshold block", done: false },
      { title: "Race simulation", done: false },
    ],
  },
  {
    id: "g2",
    title: "Launch BEPACE v1",
    description: "Ship the personal command center and use it daily for a full quarter.",
    area: "Career",
    priority: "High",
    due: "Sep 2026",
    progress: 42,
    status: "On track",
    vision: "Work that compounds",
    tasks: [
      { title: "Design system", done: true },
      { title: "Core modules", done: false },
      { title: "Daily review ritual", done: false },
    ],
  },
  {
    id: "g3",
    title: "12 months of runway",
    description: "Automate savings and rebalance the portfolio each quarter.",
    area: "Finance",
    priority: "Medium",
    due: "Dec 2026",
    progress: 55,
    status: "At risk",
    vision: "Freedom of choice",
    tasks: [
      { title: "Automate transfers", done: true },
      { title: "Q3 rebalance", done: false },
    ],
  },
  {
    id: "g4",
    title: "Read 24 books",
    description: "Two books a month, with a written summary in Knowledge.",
    area: "Knowledge",
    priority: "Medium",
    due: "Dec 2026",
    progress: 75,
    status: "On track",
    vision: "Think better every year",
    tasks: [
      { title: "18 of 24 read", done: false },
      { title: "Summaries in Knowledge", done: true },
    ],
  },
  {
    id: "g5",
    title: "Three continents this year",
    description: "One long trip per quarter, planned around low season.",
    area: "Travel",
    priority: "Low",
    due: "Nov 2026",
    progress: 33,
    status: "On track",
    vision: "A life rich in places",
    tasks: [{ title: "Book Lisbon → Tokyo", done: false }],
  },
];

export type CalendarEvent = {
  id: string;
  title: string;
  day: number; // 0 = Monday
  start: number; // hour
  end: number;
  category: "Work" | "Health" | "Personal" | "Travel";
};

export const events: CalendarEvent[] = [
  { id: "e1", title: "Morning run", day: 0, start: 7, end: 8, category: "Health" },
  { id: "e2", title: "Deep work — BEPACE", day: 0, start: 9, end: 12, category: "Work" },
  { id: "e3", title: "Design review", day: 1, start: 14, end: 15, category: "Work" },
  { id: "e4", title: "Strength session", day: 1, start: 18, end: 19, category: "Health" },
  { id: "e5", title: "Weekly planning", day: 2, start: 8, end: 9, category: "Personal" },
  { id: "e6", title: "Quarterly review", day: 3, start: 10, end: 12, category: "Work" },
  { id: "e7", title: "Dinner with Ana", day: 4, start: 20, end: 22, category: "Personal" },
  { id: "e8", title: "Flight → Lisbon", day: 5, start: 13, end: 16, category: "Travel" },
  { id: "e9", title: "Long run", day: 6, start: 7, end: 9, category: "Health" },
];

export type Note = {
  id: string;
  title: string;
  excerpt: string;
  folder: string;
  tags: string[];
  updated: string;
  favorite: boolean;
  body: string[];
};

export const noteFolders = ["All notes", "Ideas", "Work", "Personal", "Travel", "Archive"];

export const notes: Note[] = [
  {
    id: "n1",
    title: "BEPACE — first principles",
    excerpt: "The value is not in the modules, it is in the connections between them.",
    folder: "Ideas",
    tags: ["product", "systems"],
    updated: "Today, 09:12",
    favorite: true,
    body: [
      "The value is not in the modules, it is in the connections between them.",
      "A goal should be able to become a calendar block. A habit should move the Life Score. A journal entry should be able to point back at the goal it belongs to.",
      "Rule: every screen answers where am I, what matters here, what is my next action.",
    ],
  },
  {
    id: "n2",
    title: "Quarterly review template",
    excerpt: "What compounded, what leaked, what to stop doing entirely.",
    folder: "Work",
    tags: ["review", "ritual"],
    updated: "Yesterday, 21:40",
    favorite: true,
    body: [
      "What compounded this quarter?",
      "What leaked time and attention?",
      "What should I stop doing entirely?",
      "One decision I would make again. One I would not.",
    ],
  },
  {
    id: "n3",
    title: "Lisbon — places to keep",
    excerpt: "Coffee in Príncipe Real, the miradouro at sunset, the tiled staircase.",
    folder: "Travel",
    tags: ["lisbon", "places"],
    updated: "Aug 6",
    favorite: false,
    body: [
      "Coffee in Príncipe Real, early, before the street wakes up.",
      "Miradouro at sunset — arrive 30 minutes before.",
      "The tiled staircase near the cathedral.",
    ],
  },
  {
    id: "n4",
    title: "Training block — threshold",
    excerpt: "Two quality sessions, one long run, everything else easy.",
    folder: "Personal",
    tags: ["running"],
    updated: "Aug 4",
    favorite: false,
    body: ["Two quality sessions per week.", "One long run.", "Everything else strictly easy."],
  },
  {
    id: "n5",
    title: "Reading queue",
    excerpt: "Seeing Like a State, The Timeless Way of Building, Ficções.",
    folder: "Ideas",
    tags: ["reading"],
    updated: "Jul 29",
    favorite: false,
    body: ["Seeing Like a State", "The Timeless Way of Building", "Ficções"],
  },
];

export type Trip = {
  id: string;
  country: string;
  code: string;
  status: "Visited" | "Planned" | "Wishlist";
  cities: string[];
  dates: string;
  rating: number;
  memory: string;
};

export const trips: Trip[] = [
  { id: "t1", country: "Portugal", code: "PT", status: "Planned", cities: ["Lisbon", "Porto"], dates: "Sep 12 – Sep 26, 2026", rating: 0, memory: "Two weeks working from Príncipe Real." },
  { id: "t2", country: "Japan", code: "JP", status: "Wishlist", cities: ["Tokyo", "Kyoto"], dates: "Spring 2027", rating: 0, memory: "Cherry season, slow trains, no fixed plan." },
  { id: "t3", country: "Italy", code: "IT", status: "Visited", cities: ["Rome", "Florence"], dates: "May 2025", rating: 5, memory: "Walking Rome at 6am with nobody around." },
  { id: "t4", country: "Argentina", code: "AR", status: "Visited", cities: ["Buenos Aires"], dates: "Nov 2024", rating: 4, memory: "San Telmo on a Sunday." },
  { id: "t5", country: "Chile", code: "CL", status: "Visited", cities: ["Santiago", "Valparaíso"], dates: "Feb 2024", rating: 4, memory: "Cordillera visible from the kitchen window." },
  { id: "t6", country: "France", code: "FR", status: "Visited", cities: ["Paris"], dates: "Jul 2023", rating: 5, memory: "One museum per day, nothing else scheduled." },
  { id: "t7", country: "Norway", code: "NO", status: "Wishlist", cities: ["Bergen"], dates: "Undecided", rating: 0, memory: "Fjords in the long light." },
];

export const travelStats = {
  countries: 14,
  continents: 3,
  cities: 41,
  daysTravelled: 168,
  worldPercent: 7,
  next: "Lisbon — in 32 days",
};

export type JournalEntry = {
  id: string;
  date: string;
  mood: "Great" | "Good" | "Neutral" | "Low";
  energy: number;
  highlight: string;
  gratitude: string;
  learning: string;
  linkedGoal?: string;
};

export const journal: JournalEntry[] = [
  {
    id: "j1",
    date: "Tue, Aug 11",
    mood: "Good",
    energy: 4,
    highlight: "Finished the design system for BEPACE and it finally feels like one product.",
    gratitude: "A quiet morning and good coffee.",
    learning: "Depth beats decoration. Tonal layers did more than any effect.",
    linkedGoal: "Launch BEPACE v1",
  },
  {
    id: "j2",
    date: "Mon, Aug 10",
    mood: "Great",
    energy: 5,
    highlight: "Ran the long run without checking the watch once.",
    gratitude: "Legs that still answer.",
    learning: "Consistency is a mood-independent decision.",
    linkedGoal: "Run a sub-50min 10K",
  },
  {
    id: "j3",
    date: "Sun, Aug 9",
    mood: "Neutral",
    energy: 3,
    highlight: "Planned the week in 20 minutes instead of 2 hours.",
    gratitude: "A slow Sunday.",
    learning: "Planning is cheap when the system holds the context.",
  },
];

export type KnowledgeItem = {
  id: string;
  title: string;
  type: "Idea" | "Insight" | "Article" | "Summary" | "Reference";
  collection: string;
  tags: string[];
  note: string;
};

export const knowledge: KnowledgeItem[] = [
  { id: "k1", title: "Legibility destroys local knowledge", type: "Insight", collection: "Systems", tags: ["state", "complexity"], note: "Top-down simplification loses the informal knowledge that made the system work." },
  { id: "k2", title: "Patterns, not plans", type: "Idea", collection: "Design", tags: ["architecture"], note: "Good environments grow from repeated patterns rather than a single master plan." },
  { id: "k3", title: "Compounding attention", type: "Summary", collection: "Personal", tags: ["focus"], note: "Attention spent on the same problem for years behaves like capital." },
  { id: "k4", title: "The 3-question interface rule", type: "Reference", collection: "Design", tags: ["ux"], note: "Where am I, what matters here, what is my next action." },
  { id: "k5", title: "Sleep is the base layer", type: "Insight", collection: "Health", tags: ["sleep"], note: "Every other health metric degrades first through sleep." },
  { id: "k6", title: "Write to decide", type: "Idea", collection: "Personal", tags: ["writing"], note: "If the decision cannot be written in a paragraph, it is not understood yet." },
];

export const weekPlan = [
  { day: "Mon", focus: "Deep work — BEPACE core", load: 88 },
  { day: "Tue", focus: "Design review + strength", load: 64 },
  { day: "Wed", focus: "Weekly planning, admin", load: 42 },
  { day: "Thu", focus: "Quarterly review", load: 76 },
  { day: "Fri", focus: "Travel prep", load: 55 },
  { day: "Sat", focus: "Long run, reading", load: 30 },
  { day: "Sun", focus: "Rest, journal", load: 18 },
];

export const activity = [
  { label: "Completed habit", detail: "Reading — 21 day streak", when: "12m ago" },
  { label: "Goal progress", detail: "Launch BEPACE v1 → 42%", when: "1h ago" },
  { label: "Note created", detail: "BEPACE — first principles", when: "3h ago" },
  { label: "Journal entry", detail: "Tue, Aug 11", when: "5h ago" },
  { label: "Trip updated", detail: "Portugal moved to Planned", when: "Yesterday" },
];
