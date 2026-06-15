export interface Question {
  id: string;
  question: string;
  type: string; // 'technical' | 'behavioral' | 'scenario-based'
  rationale: string;
  tips: string;
}

export interface AnswerSubmission {
  questionId: string;
  questionText: string;
  userAnswer: string;
}

export interface Feedback {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  feedback: string;
  modelAnswer: string;
}

export interface QuestionResult {
  question: Question;
  userAnswer: string;
  feedback: Feedback | null;
}

export interface InterviewSession {
  id: string;
  role: string;
  skillLevel: string;
  date: string;
  questions: Question[];
  currentQuestionIndex: number;
  results: Record<string, QuestionResult>; // questionId -> result
  isCompleted: boolean;
  overallScore?: number;
  overallSummary?: string;
  strengthsSummary?: string[];
  weaknessesSummary?: string[];
  suggestionsSummary?: string[];
}
