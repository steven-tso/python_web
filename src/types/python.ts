export type Difficulty = '入門' | '進階' | '挑戰';

export type VisualizerType =
  | 'variables'
  | 'string_slice'
  | 'branch_flow'
  | 'loop_trace'
  | 'list_index'
  | 'dict_map';

export type TestMode = 'stdout' | 'function';

export interface ExerciseTestCase {
  id: string;
  label: string;
  stdin?: string;
  expectedOutput?: string;
  functionName?: string;
  args?: unknown[];
  expectedValue?: unknown;
}

export interface LessonItem {
  id: string;
  chapterId: string;
  orderLabel: string;
  title: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  summary: string;
  concepts: {
    heading: string;
    body: string;
    exampleCode: string;
  }[];
  visualizer?: VisualizerType;
  exerciseTitle: string;
  exercisePrompt: string;
  starterCode: string;
  solutionCode: string;
  hints: string[];
  testMode: TestMode;
  defaultStdin?: string;
  testCases: ExerciseTestCase[];
}

export interface Chapter {
  id: string;
  numberLabel: string;
  title: string;
  description: string;
}

export interface SandboxTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  code: string;
  stdin?: string;
}

export interface PythonDiagnosis {
  errorType: string;
  friendlyMessage: string;
  suggestion: string;
  lineNumber?: number;
}

export interface RunPythonResponse {
  ok: boolean;
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timedOut: boolean;
  durationMs: number;
  diagnosis?: PythonDiagnosis;
}

export interface TestCaseResult {
  id: string;
  label: string;
  passed: boolean;
  expected: string;
  actual: string;
  error?: string;
}

export interface GradePythonResponse {
  passedAll: boolean;
  passedCount: number;
  totalCount: number;
  results: TestCaseResult[];
  stdout: string;
  stderr: string;
  timedOut: boolean;
  durationMs: number;
  diagnosis?: PythonDiagnosis;
}

export interface LearningProgress {
  completedIds: string[];
  savedCode: Record<string, string>;
  totalRuns: number;
  lastActiveLessonId: string;
}
