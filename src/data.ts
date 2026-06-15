import { Question } from "./types";

export interface JobRoleInfo {
  id: string;
  name: string;
  category: "engineering" | "product" | "data" | "design" | "business";
  description: string;
  skills: string[];
}

export const PRESET_ROLES: JobRoleInfo[] = [
  {
    id: "software-engineer",
    name: "Software Engineer",
    category: "engineering",
    description: "Builds scalable software, architecture, algorithms, and designs system integrations.",
    skills: ["System Design", "Algorithms", "Data Structures", "API Design", "Testing & CI/CD"],
  },
  {
    id: "product-manager",
    name: "Product Manager",
    category: "product",
    description: "Launches new offerings, crafts user-centric roadmaps, and aligns technical/business goals.",
    skills: ["Product Roadmap", "User Empathy", "A/B Testing", "Agile", "Market Research"],
  },
  {
    id: "data-analyst",
    name: "Data Analyst",
    category: "data",
    description: "Extracts key intelligence, creates reports, parses SQL, and guides business decisions.",
    skills: ["SQL", "Data Visualizations", "Aesthetic Dashboards", "Statistical Modeling", "Python/R"],
  },
  {
    id: "ux-designer",
    name: "UX/UI Designer",
    category: "design",
    description: "Designs wireframes, clickable prototypes, aesthetic styles, and conducts research.",
    skills: ["Figma Design", "User Journeys", "Heuristic Evaluation", "Color Design", "Prototyping"],
  },
  {
    id: "financial-analyst",
    name: "Financial Analyst",
    category: "business",
    description: "Evaluates company budgets, tests fiscal strategies, builds models, and reports on assets.",
    skills: ["Financial Modeling", "Excel Analytics", "Valuation", "Risk Management", "Forecasting"],
  },
];

export const SKILL_LEVELS = [
  { id: "junior", name: "Associate / Junior", description: "0-2 years of experience. Focused on execution and core competence." },
  { id: "mid", name: "Mid-Level Professional", description: "2-5 years of experience. High autonomy, handles end-to-end features." },
  { id: "senior", name: "Senior specialist", description: "5+ years of experience. Designs large roadmaps, mentors, guides direction." },
  { id: "director", name: "Lead / Manager", description: "Management level. Aligns teams, drives budgets, defines strategy." },
];

export const FALLBACK_QUESTIONS: Record<string, Question[]> = {
  "software-engineer": [
    {
      id: "se-q1",
      question: "How do you handle performance optimization when working with database queries that fetch thousands of rows, and what architectural strategies would you apply?",
      type: "technical",
      rationale: "Tests understanding of SQL optimizations, connection pools, query caching, backend latency minimization, and application-level paging.",
      tips: "Mention tools like database indexing, pagination (cursor-based), select limits, denormalization, N+1 query solving, or lazy-loading."
    },
    {
      id: "se-q2",
      question: "Describe a time when you had a fierce disagreement with another senior engineer or architect regarding a critical technical stack choice. How did you resolve it?",
      type: "behavioral",
      rationale: "Evaluates mature collaborative skills, professional empathy, objective benchmarking, compromise, and constructive alignment.",
      tips: "Use the STAR method. Focus on objectivity, system metrics, comparative prototype evaluations, and standardizing consensus rather than winning the argument."
    },
    {
      id: "se-q3",
      question: "You need to build a real-time tracking dashboard that handles thousands of updates per second. How would you design the architecture of this feature?",
      type: "scenario",
      rationale: "Tests practical system design, WebSockets, message brokers (Kafka/RabbitMQ), memory-based streams (Redis), and frontend throttling/batching.",
      tips: "Outline an end-to-end flow: event producers -> message ingestion queue -> stream workers -> updates storage -> real-time feeds to client with standard batching."
    }
  ],
  "product-manager": [
    {
      id: "pm-q1",
      question: "Our flagship user onboarding completion rates have dropped by 18% in the last month. How would you investigate this metric decay?",
      type: "technical",
      rationale: "Tests diagnostic reasoning, telemetry setups, data segmenting, funnel auditing, and user interviews.",
      tips: "Divide your answer into: initial diagnostic tracking audit, segmentation (by geography, browser, channel), correlation mapping, and user observation studies."
    },
    {
      id: "pm-q2",
      question: "Tell me about a product or feature you launched that failed to achieve its goals. What did you learn and how did you pivot?",
      type: "behavioral",
      rationale: "Assesses resilience, ownership of failures, diagnostic evaluation metrics, and institutionalizing iterative discovery.",
      tips: "Clearly describe the goal, what failed, how you identified the cause, subsequent post-mortem steps, and how that error reshaped your roadmap style."
    }
  ],
  "default": [
    {
      id: "def-q1",
      question: "Tell me about a complex project or challenge you spearheaded from start to finish. What roadblocks did you encounter and how did you manage them?",
      type: "behavioral",
      rationale: "General measure of project ownership, proactive risk mitigation, planning skills, and cross-team communication.",
      tips: "Structure with Situation, Task, Action, and Quantitative Result. Clearly call out your direct contributions and project delivery metrics."
    },
    {
      id: "def-q2",
      question: "If a crucial stakeholder requests a tight feature addition right before a production launch, how would you address their request?",
      type: "scenario",
      rationale: "Tests conflict resolution, setting boundaries, analytical tradeoffs, and milestone management.",
      tips: "Be empathetic yet disciplined. Talk about evaluating the size/risk, introducing scope negotiations, presenting schedule trade-offs, or scheduling it as a V2 issue."
    }
  ]
};
