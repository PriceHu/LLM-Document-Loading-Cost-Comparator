import { SimulationParams, SimulationResult, SimulationTurn, ModelPreset, CaseId, CaseSummary, TokenSegmentBreakdown } from '../types';

export const DEFAULT_PARAMS: SimulationParams = {
  totalPages: 100, // N
  pagesPerToolCall: 2, // p
  toolCallsPerQuestion: 2, // k
  imageTokensPerPage: 2000, // tokens per image page
  textTokensPerPage: 500, // text token per page
  imagesReadPerQuestion: 1, // images read per question after parsed as text
  systemPromptTokens: 1000, // S
  tokensPerQuestion: 200, // T_q
  tokensPerToolCall: 200, // T_tc
  tokensPerAnswer: 200, // T_a
  cacheDiscountRate: 0.80, // 80% discount => pay 20%
  inputPricePerMillion: 0.15, // $0.15 / 1M
  outputPricePerMillion: 0.60, // $0.60 / 1M
};

export const MODEL_PRESETS: ModelPreset[] = [
  {
    id: 'gpt-5.6-sol',
    name: 'GPT 5.6 Sol',
    provider: 'OpenAI',
    badge: 'Frontier',
    inputPrice: 4.00,
    outputPrice: 20.00,
    cacheDiscount: 0.90,
    description: 'OpenAI high-speed agentic reasoning model with 90% prompt cache discount ($0.40/1M cached).',
  },
  {
    id: 'gpt-5.6-terra',
    name: 'GPT 5.6 Terra',
    provider: 'OpenAI',
    badge: 'Balanced',
    inputPrice: 2.00,
    outputPrice: 12.00,
    cacheDiscount: 0.85,
    description: 'Cost-optimized OpenAI workhorse with 1.1M context window and balanced reasoning throughput ($0.30/1M cached).',
  },
  {
    id: 'gpt6-astra',
    name: 'GPT6 Astra',
    provider: 'OpenAI',
    badge: 'Flagship',
    inputPrice: 10.00,
    outputPrice: 50.00,
    cacheDiscount: 0.90,
    description: 'OpenAI next-generation premier frontier flagship with 90% prompt cache discount ($1.00/1M cached).',
  },
  {
    id: 'gemini-3.8-flash',
    name: 'Gemini 3.8 Flash',
    provider: 'Google',
    badge: 'Ultra-Fast',
    inputPrice: 0.075,
    outputPrice: 0.30,
    cacheDiscount: 0.80,
    description: 'Ultra-fast multimodal model with sub-second latency and 80% context caching discount.',
  },
  {
    id: 'claude-5-opus',
    name: 'Claude 5 Opus',
    provider: 'Anthropic',
    badge: 'Flagship',
    inputPrice: 15.00,
    outputPrice: 75.00,
    cacheDiscount: 0.90,
    description: 'Anthropic premier depth reasoning model with 90% prompt cache discount.',
  },
  {
    id: 'claude-5-sonnet',
    name: 'Claude 5 Sonnet',
    provider: 'Anthropic',
    badge: 'Frontier',
    inputPrice: 3.00,
    outputPrice: 15.00,
    cacheDiscount: 0.90,
    description: 'Anthropic frontier coding and tool-calling model with 90% prompt cache discount.',
  },
  {
    id: 'qwen-3.8-max',
    name: 'Qwen 3.8 Max',
    provider: 'Qwen',
    badge: 'Flagship',
    inputPrice: 2.00,
    outputPrice: 6.00,
    cacheDiscount: 0.875,
    description: 'Alibaba Cloud flagship model with 1M context, strong multilingual reasoning and 87.5% cache discount ($0.25/1M cached).',
  },
  {
    id: 'qwen-3.8-flash',
    name: 'Qwen 3.8 Flash',
    provider: 'Qwen',
    badge: 'Cost-Efficient',
    inputPrice: 0.15,
    outputPrice: 0.47,
    cacheDiscount: 0.87,
    description: 'Ultra cost-efficient lightweight model with high throughput and prompt caching ($0.02/1M cached).',
  },
];

export function runSimulation(params: SimulationParams): SimulationResult {
  const {
    totalPages,
    pagesPerToolCall,
    toolCallsPerQuestion,
    systemPromptTokens,
    tokensPerQuestion,
    tokensPerToolCall,
    tokensPerAnswer,
    cacheDiscountRate,
    inputPricePerMillion,
    outputPricePerMillion,
    customTotalQuestions,
  } = params;

  const imageTokensPerPage = params.imageTokensPerPage || params.tokensPerPage || 2000;
  const textTokensPerPage = params.textTokensPerPage || 500;
  const imagesReadPerQuestion = params.imagesReadPerQuestion ?? 1;

  // Rate of reading in iterative text/image: pages read per question
  const pagesPerQuestion = Math.max(1, pagesPerToolCall * toolCallsPerQuestion);
  const defaultQuestions = Math.max(1, Math.ceil(totalPages / pagesPerQuestion));
  const totalQuestions = customTotalQuestions && customTotalQuestions > 0
    ? customTotalQuestions
    : defaultQuestions;

  const totalDocImageTokens = totalPages * imageTokensPerPage;
  const totalDocTextTokens = totalPages * textTokensPerPage;
  const cachedInputMultiplier = 1 - cacheDiscountRate; // e.g. 1 - 0.80 = 0.20

  const turns: SimulationTurn[] = [];

  let cumCostCase1 = 0;
  let cumCostCase2 = 0;
  let cumCostCase3 = 0;
  let cumCostCase4 = 0;

  let contextEndCase1 = 0;
  let contextEndCase2 = 0;
  let contextEndCase3 = 0;
  let contextEndCase4 = 0;

  let totalTokensCase1 = 0;
  let totalTokensCase2 = 0;
  let totalTokensCase3 = 0;
  let totalTokensCase4 = 0;

  // Running cumulative token breakdowns
  let cumBreakdownC1: TokenSegmentBreakdown = { systemPrompt: 0, userQuestions: 0, toolCalls: 0, docTokens: 0, answers: 0 };
  let cumBreakdownC2: TokenSegmentBreakdown = { systemPrompt: 0, userQuestions: 0, toolCalls: 0, docTokens: 0, answers: 0 };
  let cumBreakdownC3: TokenSegmentBreakdown = { systemPrompt: 0, userQuestions: 0, toolCalls: 0, docTokens: 0, imageTokens: 0, answers: 0 };
  let cumBreakdownC4: TokenSegmentBreakdown = { systemPrompt: 0, userQuestions: 0, toolCalls: 0, docTokens: 0, imageTokens: 0, answers: 0 };

  for (let q = 1; q <= totalQuestions; q++) {
    // =========================================================================
    // CASE 1: All Images Upfront (Pure Image Ingestion)
    // =========================================================================
    let c1NewInput = 0;
    let c1CachedInput = 0;
    const c1Output = tokensPerAnswer;

    if (q === 1) {
      // Turn 1: System prompt + All doc page images + Question 1
      c1NewInput = systemPromptTokens + totalDocImageTokens + tokensPerQuestion;
      c1CachedInput = 0;
      contextEndCase1 = c1NewInput + c1Output;
    } else {
      // Subsequent turns: Entire past context cached, only new question is full price
      c1CachedInput = contextEndCase1;
      c1NewInput = tokensPerQuestion;
      contextEndCase1 += c1NewInput + c1Output;
    }

    const c1TurnCost =
      (c1NewInput / 1_000_000) * inputPricePerMillion +
      (c1CachedInput / 1_000_000) * (inputPricePerMillion * cachedInputMultiplier) +
      (c1Output / 1_000_000) * outputPricePerMillion;

    cumCostCase1 += c1TurnCost;
    totalTokensCase1 += c1NewInput + c1CachedInput + c1Output;

    // Tokens accumulated across all invocations in Question q (1 invocation)
    const c1TurnBreakdown: TokenSegmentBreakdown = {
      systemPrompt: systemPromptTokens,
      userQuestions: q * tokensPerQuestion,
      toolCalls: 0,
      docTokens: totalDocImageTokens,
      answers: q * tokensPerAnswer,
    };
    cumBreakdownC1 = {
      systemPrompt: cumBreakdownC1.systemPrompt + c1TurnBreakdown.systemPrompt,
      userQuestions: cumBreakdownC1.userQuestions + c1TurnBreakdown.userQuestions,
      toolCalls: 0,
      docTokens: cumBreakdownC1.docTokens + c1TurnBreakdown.docTokens,
      answers: cumBreakdownC1.answers + c1TurnBreakdown.answers,
    };
    const c1ContextBreakdown: TokenSegmentBreakdown = { ...c1TurnBreakdown };

    // =========================================================================
    // CASE 2: Iterative Page Images by Tool (Sequential ReAct: k tool calls)
    // =========================================================================
    const c2PagesBefore = Math.min(totalPages, (q - 1) * toolCallsPerQuestion * pagesPerToolCall);
    let c2TurnNewInputTotal = 0;
    let c2TurnCachedInputTotal = 0;
    let c2TurnOutputTotal = 0;
    let activeContext2 = contextEndCase2;

    let c2DocPagesSum = 0;
    let c2CurrentPages = c2PagesBefore;

    // Step 0: User asks Question q, LLM decides first tool call
    const c2Step0NewInput = (q === 1 ? systemPromptTokens : 0) + tokensPerQuestion;
    const c2Step0CachedInput = q === 1 ? 0 : activeContext2;
    const c2Step0Output = tokensPerToolCall;

    c2TurnNewInputTotal += c2Step0NewInput;
    c2TurnCachedInputTotal += c2Step0CachedInput;
    c2TurnOutputTotal += c2Step0Output;
    c2DocPagesSum += c2CurrentPages; // Step 0 context contains c2PagesBefore

    activeContext2 = c2Step0CachedInput + c2Step0NewInput + c2Step0Output;

    // Steps 1 to k: Tool executions returning page images
    for (let i = 1; i <= toolCallsPerQuestion; i++) {
      c2CurrentPages = Math.min(totalPages, c2PagesBefore + i * pagesPerToolCall);
      const toolResultTokens = pagesPerToolCall * imageTokensPerPage;

      const isLastStep = i === toolCallsPerQuestion;
      const stepNewInput = toolResultTokens;
      const stepCachedInput = activeContext2;
      const stepOutput = isLastStep ? tokensPerAnswer : tokensPerToolCall;

      c2TurnNewInputTotal += stepNewInput;
      c2TurnCachedInputTotal += stepCachedInput;
      c2TurnOutputTotal += stepOutput;
      c2DocPagesSum += c2CurrentPages;

      activeContext2 = stepCachedInput + stepNewInput + stepOutput;
    }

    contextEndCase2 = activeContext2;
    const c2TurnCost =
      (c2TurnNewInputTotal / 1_000_000) * inputPricePerMillion +
      (c2TurnCachedInputTotal / 1_000_000) * (inputPricePerMillion * cachedInputMultiplier) +
      (c2TurnOutputTotal / 1_000_000) * outputPricePerMillion;

    cumCostCase2 += c2TurnCost;
    totalTokensCase2 += c2TurnNewInputTotal + c2TurnCachedInputTotal + c2TurnOutputTotal;

    // Tokens accumulated in Question q across all k + 1 model invocations:
    const k2 = toolCallsPerQuestion;
    const c2TurnDocTokens = c2DocPagesSum * imageTokensPerPage;
    const c2TurnSysPrompt = (k2 + 1) * systemPromptTokens;
    const c2TurnUserQuestions = (k2 + 1) * q * tokensPerQuestion;
    const c2TurnToolCalls =
      ((k2 + 1) * (q - 1) * k2 + (k2 * (k2 + 1)) / 2 + k2) * tokensPerToolCall;
    const c2TurnAnswers = ((k2 + 1) * (q - 1) + 1) * tokensPerAnswer;

    const c2TurnBreakdown: TokenSegmentBreakdown = {
      systemPrompt: c2TurnSysPrompt,
      userQuestions: c2TurnUserQuestions,
      toolCalls: c2TurnToolCalls,
      docTokens: c2TurnDocTokens,
      answers: c2TurnAnswers,
    };
    cumBreakdownC2 = {
      systemPrompt: cumBreakdownC2.systemPrompt + c2TurnBreakdown.systemPrompt,
      userQuestions: cumBreakdownC2.userQuestions + c2TurnBreakdown.userQuestions,
      toolCalls: cumBreakdownC2.toolCalls + c2TurnBreakdown.toolCalls,
      docTokens: cumBreakdownC2.docTokens + c2TurnBreakdown.docTokens,
      answers: cumBreakdownC2.answers + c2TurnBreakdown.answers,
    };
    const c2ContextBreakdown: TokenSegmentBreakdown = {
      systemPrompt: systemPromptTokens,
      userQuestions: q * tokensPerQuestion,
      toolCalls: q * toolCallsPerQuestion * tokensPerToolCall,
      docTokens: c2CurrentPages * imageTokensPerPage,
      answers: q * tokensPerAnswer,
    };

    // =========================================================================
    // CASE 3: All Text Upfront + 1 Page Image Tool per Question
    // =========================================================================
    let c3TurnNewInputTotal = 0;
    let c3TurnCachedInputTotal = 0;
    let c3TurnOutputTotal = 0;
    let activeContext3 = contextEndCase3;

    // Step 1: LLM sees context (text + question), decides 1 page image tool call
    const c3Step1NewInput = (q === 1 ? systemPromptTokens + totalDocTextTokens : 0) + tokensPerQuestion;
    const c3Step1CachedInput = q === 1 ? 0 : activeContext3;
    const c3Step1Output = tokensPerToolCall;

    c3TurnNewInputTotal += c3Step1NewInput;
    c3TurnCachedInputTotal += c3Step1CachedInput;
    c3TurnOutputTotal += c3Step1Output;

    activeContext3 = c3Step1CachedInput + c3Step1NewInput + c3Step1Output;

    // Step 2: Tool returns page image(s), LLM outputs final answer
    const imageTokensReturned = imagesReadPerQuestion * imageTokensPerPage;
    const c3Step2NewInput = imageTokensReturned;
    const c3Step2CachedInput = activeContext3;
    const c3Step2Output = tokensPerAnswer;

    c3TurnNewInputTotal += c3Step2NewInput;
    c3TurnCachedInputTotal += c3Step2CachedInput;
    c3TurnOutputTotal += c3Step2Output;

    activeContext3 = c3Step2CachedInput + c3Step2NewInput + c3Step2Output;
    contextEndCase3 = activeContext3;

    const c3TurnCost =
      (c3TurnNewInputTotal / 1_000_000) * inputPricePerMillion +
      (c3TurnCachedInputTotal / 1_000_000) * (inputPricePerMillion * cachedInputMultiplier) +
      (c3TurnOutputTotal / 1_000_000) * outputPricePerMillion;

    cumCostCase3 += c3TurnCost;
    totalTokensCase3 += c3TurnNewInputTotal + c3TurnCachedInputTotal + c3TurnOutputTotal;

    // Tokens accumulated in Question q across the 2 model invocations:
    const c3TurnDocText = 2 * totalDocTextTokens;
    const c3TurnDocImages = (2 * q - 1) * imagesReadPerQuestion * imageTokensPerPage;
    const c3TurnSysPrompt = 2 * systemPromptTokens;
    const c3TurnUserQuestions = 2 * q * tokensPerQuestion;
    const c3TurnToolCalls = 2 * q * tokensPerToolCall;
    const c3TurnAnswers = (2 * q - 1) * tokensPerAnswer;

    const c3TurnBreakdown: TokenSegmentBreakdown = {
      systemPrompt: c3TurnSysPrompt,
      userQuestions: c3TurnUserQuestions,
      toolCalls: c3TurnToolCalls,
      docTokens: c3TurnDocText,
      imageTokens: c3TurnDocImages,
      answers: c3TurnAnswers,
    };
    cumBreakdownC3 = {
      systemPrompt: cumBreakdownC3.systemPrompt + c3TurnBreakdown.systemPrompt,
      userQuestions: cumBreakdownC3.userQuestions + c3TurnBreakdown.userQuestions,
      toolCalls: cumBreakdownC3.toolCalls + c3TurnBreakdown.toolCalls,
      docTokens: cumBreakdownC3.docTokens + c3TurnBreakdown.docTokens,
      imageTokens: (cumBreakdownC3.imageTokens || 0) + (c3TurnBreakdown.imageTokens || 0),
      answers: cumBreakdownC3.answers + c3TurnBreakdown.answers,
    };
    const c3ContextBreakdown: TokenSegmentBreakdown = {
      systemPrompt: systemPromptTokens,
      userQuestions: q * tokensPerQuestion,
      toolCalls: q * tokensPerToolCall,
      docTokens: totalDocTextTokens,
      imageTokens: q * imagesReadPerQuestion * imageTokensPerPage,
      answers: q * tokensPerAnswer,
    };

    // =========================================================================
    // CASE 4: Iterative Text Pages + 1 Page Image Tool per Question
    // (k text tool calls + 1 image tool call + 1 answer = k + 2 steps)
    // =========================================================================
    const c4TextPagesBefore = Math.min(totalPages, (q - 1) * toolCallsPerQuestion * pagesPerToolCall);
    const c4ImagesBefore = (q - 1) * imagesReadPerQuestion;

    let c4TurnNewInputTotal = 0;
    let c4TurnCachedInputTotal = 0;
    let c4TurnOutputTotal = 0;
    let activeContext4 = contextEndCase4;

    let c4TextPagesSum = 0;
    let c4CurrentTextPages = c4TextPagesBefore;

    // Step 0: User asks Question q, LLM decides first text tool call
    const c4Step0NewInput = (q === 1 ? systemPromptTokens : 0) + tokensPerQuestion;
    const c4Step0CachedInput = q === 1 ? 0 : activeContext4;
    const c4Step0Output = tokensPerToolCall;

    c4TurnNewInputTotal += c4Step0NewInput;
    c4TurnCachedInputTotal += c4Step0CachedInput;
    c4TurnOutputTotal += c4Step0Output;
    c4TextPagesSum += c4CurrentTextPages; // Step 0 sees c4TextPagesBefore

    activeContext4 = c4Step0CachedInput + c4Step0NewInput + c4Step0Output;

    // Steps 1 to k: Text tool executions
    for (let i = 1; i <= toolCallsPerQuestion; i++) {
      c4CurrentTextPages = Math.min(totalPages, c4TextPagesBefore + i * pagesPerToolCall);
      const textResultTokens = pagesPerToolCall * textTokensPerPage;

      // When the text calls finish, next is the image tool call
      const stepNewInput = textResultTokens;
      const stepCachedInput = activeContext4;
      const stepOutput = tokensPerToolCall;

      c4TurnNewInputTotal += stepNewInput;
      c4TurnCachedInputTotal += stepCachedInput;
      c4TurnOutputTotal += stepOutput;
      c4TextPagesSum += c4CurrentTextPages;

      activeContext4 = stepCachedInput + stepNewInput + stepOutput;
    }

    // Step k + 1: Image tool execution returning page image(s) -> final answer
    const imageResultTokens = imagesReadPerQuestion * imageTokensPerPage;
    const c4ImageStepNewInput = imageResultTokens;
    const c4ImageStepCachedInput = activeContext4;
    const c4ImageStepOutput = tokensPerAnswer;

    c4TurnNewInputTotal += c4ImageStepNewInput;
    c4TurnCachedInputTotal += c4ImageStepCachedInput;
    c4TurnOutputTotal += c4ImageStepOutput;
    c4TextPagesSum += c4CurrentTextPages; // Step k + 1 sees final text pages

    activeContext4 = c4ImageStepCachedInput + c4ImageStepNewInput + c4ImageStepOutput;
    contextEndCase4 = activeContext4;

    const c4TurnCost =
      (c4TurnNewInputTotal / 1_000_000) * inputPricePerMillion +
      (c4TurnCachedInputTotal / 1_000_000) * (inputPricePerMillion * cachedInputMultiplier) +
      (c4TurnOutputTotal / 1_000_000) * outputPricePerMillion;

    cumCostCase4 += c4TurnCost;
    totalTokensCase4 += c4TurnNewInputTotal + c4TurnCachedInputTotal + c4TurnOutputTotal;

    // Tokens accumulated in Question q across all k + 2 model invocations:
    const k4 = toolCallsPerQuestion;
    const totalStepsC4 = k4 + 2;
    const c4TurnDocText = c4TextPagesSum * textTokensPerPage;
    const c4TurnImagePages = (k4 + 1) * c4ImagesBefore + (c4ImagesBefore + imagesReadPerQuestion);
    const c4TurnDocImages = c4TurnImagePages * imageTokensPerPage;
    const c4TurnSysPrompt = totalStepsC4 * systemPromptTokens;
    const c4TurnUserQuestions = totalStepsC4 * q * tokensPerQuestion;
    const c4InputToolCalls =
      totalStepsC4 * (q - 1) * (k4 + 1) + ((k4 + 1) * (k4 + 2)) / 2;
    const c4TurnToolCalls = (c4InputToolCalls + (k4 + 1)) * tokensPerToolCall;
    const c4TurnAnswers = (totalStepsC4 * (q - 1) + 1) * tokensPerAnswer;

    const c4TurnBreakdown: TokenSegmentBreakdown = {
      systemPrompt: c4TurnSysPrompt,
      userQuestions: c4TurnUserQuestions,
      toolCalls: c4TurnToolCalls,
      docTokens: c4TurnDocText,
      imageTokens: c4TurnDocImages,
      answers: c4TurnAnswers,
    };
    cumBreakdownC4 = {
      systemPrompt: cumBreakdownC4.systemPrompt + c4TurnBreakdown.systemPrompt,
      userQuestions: cumBreakdownC4.userQuestions + c4TurnBreakdown.userQuestions,
      toolCalls: cumBreakdownC4.toolCalls + c4TurnBreakdown.toolCalls,
      docTokens: cumBreakdownC4.docTokens + c4TurnBreakdown.docTokens,
      imageTokens: (cumBreakdownC4.imageTokens || 0) + (c4TurnBreakdown.imageTokens || 0),
      answers: cumBreakdownC4.answers + c4TurnBreakdown.answers,
    };
    const c4ContextBreakdown: TokenSegmentBreakdown = {
      systemPrompt: systemPromptTokens,
      userQuestions: q * tokensPerQuestion,
      toolCalls: q * (toolCallsPerQuestion + 1) * tokensPerToolCall,
      docTokens: c4CurrentTextPages * textTokensPerPage,
      imageTokens: q * imagesReadPerQuestion * imageTokensPerPage,
      answers: q * tokensPerAnswer,
    };

    // Record turn ledger
    turns.push({
      turnIndex: q,
      case1: {
        questionIndex: q,
        newInputTokens: c1NewInput,
        cachedInputTokens: c1CachedInput,
        outputTokens: c1Output,
        turnCost: c1TurnCost,
        cumulativeCost: cumCostCase1,
        contextLengthEnd: contextEndCase1,
        tokensBreakdown: c1TurnBreakdown,
        cumulativeTokensBreakdown: { ...cumBreakdownC1 },
        contextTokensBreakdown: c1ContextBreakdown,
      },
      case2: {
        questionIndex: q,
        newInputTokens: c2TurnNewInputTotal,
        cachedInputTokens: c2TurnCachedInputTotal,
        outputTokens: c2TurnOutputTotal,
        turnCost: c2TurnCost,
        cumulativeCost: cumCostCase2,
        contextLengthEnd: contextEndCase2,
        tokensBreakdown: c2TurnBreakdown,
        cumulativeTokensBreakdown: { ...cumBreakdownC2 },
        contextTokensBreakdown: c2ContextBreakdown,
      },
      case3: {
        questionIndex: q,
        newInputTokens: c3TurnNewInputTotal,
        cachedInputTokens: c3TurnCachedInputTotal,
        outputTokens: c3TurnOutputTotal,
        turnCost: c3TurnCost,
        cumulativeCost: cumCostCase3,
        contextLengthEnd: contextEndCase3,
        tokensBreakdown: c3TurnBreakdown,
        cumulativeTokensBreakdown: { ...cumBreakdownC3 },
        contextTokensBreakdown: c3ContextBreakdown,
      },
      case4: {
        questionIndex: q,
        newInputTokens: c4TurnNewInputTotal,
        cachedInputTokens: c4TurnCachedInputTotal,
        outputTokens: c4TurnOutputTotal,
        turnCost: c4TurnCost,
        cumulativeCost: cumCostCase4,
        contextLengthEnd: contextEndCase4,
        tokensBreakdown: c4TurnBreakdown,
        cumulativeTokensBreakdown: { ...cumBreakdownC4 },
        contextTokensBreakdown: c4ContextBreakdown,
      },
    });
  }

  // Determine overall winner and ranking among all 4 cases
  const costs: { id: CaseId; cost: number; tokens: number; ctx: number; name: string }[] = [
    { id: 'case1', cost: cumCostCase1, tokens: totalTokensCase1, ctx: contextEndCase1, name: 'All Images Upfront' },
    { id: 'case2', cost: cumCostCase2, tokens: totalTokensCase2, ctx: contextEndCase2, name: 'Iterative Images (Tool)' },
    { id: 'case3', cost: cumCostCase3, tokens: totalTokensCase3, ctx: contextEndCase3, name: 'All Text Upfront + Image Tool' },
    { id: 'case4', cost: cumCostCase4, tokens: totalTokensCase4, ctx: contextEndCase4, name: 'Iterative Text + Image Tool' },
  ];

  costs.sort((a, b) => a.cost - b.cost);

  const cases: CaseSummary[] = costs.map((c, index) => ({
    id: c.id,
    name: c.name,
    totalCost: c.cost,
    totalTokens: c.tokens,
    finalContextLength: c.ctx,
    costRank: index + 1,
  }));

  const winnerAtEnd = costs[0].id;
  const lowestCostAtEnd = costs[0].cost;
  const highestCostAtEnd = costs[costs.length - 1].cost;

  return {
    totalQuestions,
    totalPages,
    turns,
    winnerAtEnd,
    lowestCostAtEnd,
    highestCostAtEnd,
    totalCostCase1: cumCostCase1,
    totalCostCase2: cumCostCase2,
    totalCostCase3: cumCostCase3,
    totalCostCase4: cumCostCase4,
    totalTokensCase1,
    totalTokensCase2,
    totalTokensCase3,
    totalTokensCase4,
    cases,
    params,
  };
}

export function formatCurrency(amount: number): string {
  if (amount < 0.001 && amount > 0) {
    return `$${amount.toFixed(4)}`;
  }
  if (amount < 0.01) {
    return `$${amount.toFixed(4)}`;
  }
  if (amount < 1) {
    return `$${amount.toFixed(3)}`;
  }
  return `$${amount.toFixed(2)}`;
}

export function formatTokens(num: number): string {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}k`;
  }
  return num.toLocaleString();
}
