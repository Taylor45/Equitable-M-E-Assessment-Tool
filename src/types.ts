export type EquityLevel = 'L1' | 'L2' | 'L3';

export interface QuestionOption {
  text: string;
  level: EquityLevel;
  description?: string;
  feedback?: string;
}

export interface Question {
  id: number;
  dimensionId: number;
  section: string;
  text: string;
  options: [QuestionOption, QuestionOption, QuestionOption]; // Strict 3 options pattern
}

export interface Dimension {
  id: number;
  name: string;
  subtitle: string;
  purpose: string;
  questionIds: number[];
  feedback: {
    L1: string;
    L2: string;
    L3: string;
    tie?: string;
  };
}

export interface AssessmentState {
  answers: Record<number, EquityLevel>; // questionId -> selected level
  currentQuestionId: number;
  currentDimensionId: number;
  isCompleted: boolean;
  viewingDimensionFeedbackId: number | null; // dimensionId if currently viewing end-of-dimension feedback
}
