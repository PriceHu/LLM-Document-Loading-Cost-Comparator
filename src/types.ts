export interface SimulationParams {
  totalPages: number; // N
  pagesPerToolCall: number; // p
  toolCallsPerQuestion: number; // k
  imageTokensPerPage: number; // tokens per image page (default 2000)
  tokensPerPage?: number; // legacy alias
  textTokensPerPage: number; // text token per page (default 500)
  imagesReadPerQuestion: number; // images read per question after parsed as text (default 1)
  systemPromptTokens: number; // S
  tokensPerQuestion: number; // T_q
  tokensPerToolCall: number; // T_tc
  tokensPerAnswer: number; // T_a
  cacheDiscountRate: number; // 0.80 -> pay 0.20
  inputPricePerMillion: number; // $ / 1M
  outputPricePerMillion: number; // $ / 1M
  customTotalQuestions?: number; // optional override for questions
}

export interface TurnMetrics {
  questionIndex: number;
  newInputTokens: number;
  cachedInputTokens: number;
  outputTokens: number;
  turnCost: number;
  cumulativeCost: number;
  contextLengthEnd: number;
  tokensBreakdown: {
    systemPrompt: number;
    userQuestions: number;
    toolCalls: number;
    docTokens: number;
    imageTokens?: number;
    answers: number;
  };
}

export interface SimulationTurn {
  turnIndex: number; // 1-based question number
  case1: TurnMetrics; // All Images Upfront
  case2: TurnMetrics; // Iterative Page Images by Tool
  case3: TurnMetrics; // All Text Upfront + 1 Page Image Tool
  case4: TurnMetrics; // Iterative Text Pages + 1 Page Image Tool
}

export type CaseId = 'case1' | 'case2' | 'case3' | 'case4';

export interface CaseSummary {
  id: CaseId;
  name: string;
  totalCost: number;
  totalTokens: number;
  finalContextLength: number;
  costRank: number; // 1 to 4
}

export interface SimulationResult {
  totalQuestions: number;
  totalPages: number;
  turns: SimulationTurn[];
  winnerAtEnd: CaseId;
  lowestCostAtEnd: number;
  highestCostAtEnd: number;
  totalCostCase1: number;
  totalCostCase2: number;
  totalCostCase3: number;
  totalCostCase4: number;
  totalTokensCase1: number;
  totalTokensCase2: number;
  totalTokensCase3: number;
  totalTokensCase4: number;
  cases: CaseSummary[];
  params: SimulationParams;
}

export interface ModelPreset {
  id: string;
  name: string;
  provider: 'Google' | 'Anthropic' | 'OpenAI' | 'Qwen';
  inputPrice: number;
  outputPrice: number;
  cacheDiscount: number;
  description: string;
  badge?: string;
}
