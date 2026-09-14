export type Language = 'en' | 'zh' | 'ja';

export interface Translations {
  header: {
    title: string;
    subtitle: string;
    langSelect: string;
    badgeDoc: string;
    badgeCache: string;
    badgeQuestions: string;
    resetTitle: string;
  };
  common: {
    reset: string;
    case1Name: string;
    case2Name: string;
    case3Name: string;
    case4Name: string;
    case1Short: string;
    case2Short: string;
    case3Short: string;
    case4Short: string;
    questions: string;
    tokens: string;
    pages: string;
    call: string;
    calls: string;
    turn: string;
    cost: string;
    savings: string;
    rank: string;
    winner: string;
    images: string;
  };
  metrics: {
    winnerTitle: string;
    winnerDesc: string;
    lowestCostLabel: string;
    highestCostLabel: string;
    costSpreadLabel: string;
    rankingTitle: string;
    turn1CostTitle: string;
    finalTurnCostTitle: string;
    contextFootprintTitle: string;
    contextFootprintDesc: string;
  };
  params: {
    title: string;
    subtitle: string;
    presetsLabel: string;
    input: string;
    output: string;
    cacheDiscount: string;
    off: string;
    providerAll: string;
    secDoc: string;
    secMessage: string;
    secPricing: string;
    totalPagesLabel: string;
    imageTokensPerPageLabel: string;
    textTokensPerPageLabel: string;
    imagesReadPerQLabel: string;
    imagesReadPerQDesc: string;
    pagesPerToolLabel: string;
    toolCallsPerQLabel: string;
    toolCallsHeadToHeadDesc: string;
    readSpeed: string;
    questionsToRead: string;
    syncEqual: string;
    syncIndependent: string;
    syncTitle: string;
    tokensPerQ: string;
    tokensPerTool: string;
    tokensPerAns: string;
    sysPromptTokens: string;
    modelInputPrice: string;
    modelOutputPrice: string;
    cacheDiscountRate: string;
    cachedBilledAt: string;
    customQuestionsTitle: string;
    customQuestionsAuto: string;
    customQuestionsCustom: string;
  };
  charts: {
    tabCumulative: string;
    tabMarginal: string;
    tabContext: string;
    tabBreakdown: string;
    cumTitle: string;
    cumSubtitle: string;
    marginalTitle: string;
    marginalSubtitle: string;
    contextTitle: string;
    contextSubtitle: string;
    breakdownTitle: string;
    breakdownSubtitle: string;
    legendC1: string;
    legendC2: string;
    legendC3: string;
    legendC4: string;
    legendSysPrompt: string;
    legendQuestions: string;
    legendToolCalls: string;
    legendDoc: string;
    legendDocImages: string;
    legendDocText: string;
    legendAnswers: string;
    questionSliderLabel: string;
    breakdownTurnMode: string;
    breakdownCumulativeMode: string;
    breakdownSubtitleAccumulated: string;
    totalTokensAtQ: string;
    xAxisQuestion: string;
    yAxisCost: string;
    yAxisTokens: string;
    curveSmooth: string;
    curveLinear: string;
    exportBtn: string;
    exportPng: string;
    exportSvg: string;
    exporting: string;
    legendTitle: string;
    legendToggle: string;
    c1Sub: string;
    c2Sub: string;
    c3Sub: string;
    c4Sub: string;
    cacheDiscountFootnote: string;
    retrievalParityFootnote: string;
    callsPerQ: string;
  };
  table: {
    title: string;
    subtitle: string;
    colQuestion: string;
    colC1: string;
    colC2: string;
    colC3: string;
    colC4: string;
    colWinner: string;
    searchPlaceholder: string;
  };
  explainer: {
    title: string;
    subtitle: string;
    case1Title: string;
    case1Desc: string;
    case2Title: string;
    case2Desc: string;
    case3Title: string;
    case3Desc: string;
    case4Title: string;
    case4Desc: string;
    tableTitle: string;
    colCase: string;
    colStrategy: string;
    colToolCallsPerQ: string;
    colContextPattern: string;
    colIdealFor: string;
    insightTitle: string;
    insight1Title: string;
    insight1Desc: string;
    insight2Title: string;
    insight2Desc: string;
    insight3Title: string;
    insight3Desc: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    header: {
      title: 'LLM Document Ingestion Cost Comparator',
      subtitle: 'Simulating 4 architectural paradigms: Full Images, Tool Images, Text + Image Tool, and Iterative Text + Image Tool under context caching.',
      langSelect: 'Language',
      badgeDoc: 'Doc: {pages} pgs',
      badgeCache: 'Cache: {discount}% Off (pay {pay}%)',
      badgeQuestions: '{count} Questions Total',
      resetTitle: 'Reset parameters to defaults',
    },
    common: {
      reset: 'Reset',
      case1Name: 'Case 1: All Images Upfront',
      case2Name: 'Case 2: Iterative Images (Tool)',
      case3Name: 'Case 3: All Text Upfront + Image Tool',
      case4Name: 'Case 4: Iterative Text + Image Tool',
      case1Short: 'C1: All Images',
      case2Short: 'C2: Tool Images',
      case3Short: 'C3: Text + Image Tool',
      case4Short: 'C4: Iter Text + Image',
      questions: 'Questions',
      tokens: 'tokens',
      pages: 'pgs',
      call: 'call',
      calls: 'calls',
      turn: 'Turn',
      cost: 'Cost',
      savings: 'Savings',
      rank: 'Rank',
      winner: 'Most Cost-Effective',
      images: 'images',
    },
    metrics: {
      winnerTitle: 'Most Cost-Effective Architecture',
      winnerDesc: 'Achieves the lowest cumulative expenditure over the entire {totalQuestions}-question workload.',
      lowestCostLabel: 'Lowest Total:',
      highestCostLabel: 'Highest Total:',
      costSpreadLabel: 'Cost Spread:',
      rankingTitle: 'Cumulative Cost Leaderboard (Q{q})',
      turn1CostTitle: 'Turn 1 Cold-Start Cost',
      finalTurnCostTitle: 'Final Turn (Q{q}) Marginal Cost',
      contextFootprintTitle: 'Final Active Context Window',
      contextFootprintDesc: 'Total tokens stored in context and billed as cached input on subsequent turns.',
    },
    params: {
      title: 'Simulation Parameters',
      subtitle: 'Tune document sizing, token weights, multimodal image retrieval, and model pricing tiers.',
      presetsLabel: 'Model Presets & Cache Pricing',
      input: 'Input',
      output: 'Output',
      cacheDiscount: 'Cache Discount',
      off: 'off',
      providerAll: 'All Providers',
      secDoc: 'Document & Modality Parameters',
      secMessage: 'Message & Tool Token Sizing',
      secPricing: 'Model Pricing & Cache Rate',
      totalPagesLabel: 'Total Document Pages (N)',
      imageTokensPerPageLabel: 'Image Tokens / Page',
      textTokensPerPageLabel: 'Text Tokens / Page (OCR / Parse)',
      imagesReadPerQLabel: 'Images Read / Question',
      imagesReadPerQDesc: 'Page images inspected per question in Cases 3 & 4',
      pagesPerToolLabel: 'Pages per Tool Call (p)',
      toolCallsPerQLabel: 'Page Retrieval Tool Calls / Question (k)',
      toolCallsHeadToHeadDesc: 'Head-to-head comparison: In Case 2, these k calls fetch image pages; in Case 4, these k calls fetch text pages (plus 1 image call).',
      readSpeed: 'Document Scan Rate',
      questionsToRead: 'Questions to Scan Doc',
      syncEqual: 'Synchronized Token Sizes',
      syncIndependent: 'Independent Token Sizes',
      syncTitle: 'Lock Question, Tool Call & Answer tokens',
      tokensPerQ: 'Tokens per User Question (T_q)',
      tokensPerTool: 'Tokens per Tool Call Header (T_tc)',
      tokensPerAns: 'Tokens per Answer (T_a)',
      sysPromptTokens: 'System Prompt Tokens (S)',
      modelInputPrice: 'Input Price ($ / 1M Tokens)',
      modelOutputPrice: 'Output Price ($ / 1M Tokens)',
      cacheDiscountRate: 'Context Cache Discount Rate',
      cachedBilledAt: 'Cached input billed at {rate}% of standard rate',
      customQuestionsTitle: 'Total Evaluation Questions',
      customQuestionsAuto: 'Auto ({count} Qs)',
      customQuestionsCustom: 'Custom Count',
    },
    charts: {
      tabCumulative: 'Cumulative Cost ($)',
      tabMarginal: 'Marginal Cost / Turn ($)',
      tabContext: 'Context Growth (Tokens)',
      tabBreakdown: 'Token Composition',
      cumTitle: 'Cumulative Expenditure Across 4 Architectures',
      cumSubtitle: 'Total dollar cost over time under cumulative context and 80% cache discount.',
      marginalTitle: 'Per-Question Marginal Cost ($/Turn)',
      marginalSubtitle: 'Cost incurred specifically on each individual question turn.',
      contextTitle: 'Context Length Accumulation',
      contextSubtitle: 'Total tokens retained in memory and billed as cached input in subsequent turns.',
      breakdownTitle: 'Token Composition by Category',
      breakdownSubtitle: 'Distribution of System, Question, Tool Call, Document Text, Page Image, and Answer tokens.',
      legendC1: 'Case 1: All Images Upfront',
      legendC2: 'Case 2: Iterative Images (Tool)',
      legendC3: 'Case 3: All Text Upfront + Image Tool',
      legendC4: 'Case 4: Iterative Text + Image Tool',
      legendSysPrompt: 'System Prompt',
      legendQuestions: 'Questions',
      legendToolCalls: 'Tool Calls',
      legendDoc: 'Doc Content (Text / Images)',
      legendDocImages: 'Doc Images',
      legendDocText: 'Doc Text',
      legendAnswers: 'Answers',
      questionSliderLabel: 'Select Question (Turn)',
      breakdownTurnMode: 'Question Q{q} (All Steps In Turn)',
      breakdownCumulativeMode: 'Cumulative (Q1 to Q{q})',
      breakdownSubtitleAccumulated: 'Total tokens processed across all model invocations and tool steps within Question Q{q}.',
      totalTokensAtQ: 'Total Tokens at Q{q}',
      xAxisQuestion: 'Question',
      yAxisCost: 'Cost (USD)',
      yAxisTokens: 'Tokens',
      curveSmooth: 'Smooth Spline',
      curveLinear: 'Precise Linear',
      exportBtn: 'Export Visual',
      exportPng: 'PNG Image (.png)',
      exportSvg: 'Vector Graphic (.svg)',
      exporting: 'Exporting...',
      legendTitle: 'Architectural Legend',
      legendToggle: 'Toggle views',
      c1Sub: 'All doc page images upfront',
      c2Sub: '{calls} page image tool calls/Q',
      c3Sub: 'All text upfront + 1 image call',
      c4Sub: '{calls} text calls + 1 image call',
      cacheDiscountFootnote: 'Cache discount:',
      retrievalParityFootnote: 'Retrieval parity:',
      callsPerQ: 'calls/Q',
    },
    table: {
      title: 'Turn-by-Turn Numerical Ledger',
      subtitle: 'Complete analytical ledger tracking exact costs and context expansion across all 4 cases.',
      colQuestion: 'Turn / Q#',
      colC1: 'Case 1 (All Images)',
      colC2: 'Case 2 (Tool Images)',
      colC3: 'Case 3 (Text + Image)',
      colC4: 'Case 4 (Iter Text + Image)',
      colWinner: 'Lowest Turn Cost',
      searchPlaceholder: 'Search question turn...',
    },
    explainer: {
      title: 'Architectural Analysis: 4 Document Ingestion Strategies',
      subtitle: 'Comprehensive evaluation of token footprint, cache efficiency, and multimodal inspection tradeoffs.',
      case1Title: 'Case 1: All Images Upfront (Pure Image Ingestion)',
      case1Desc: 'All N document pages are rendered as images and loaded into context in Turn 1. No tool calls are executed in subsequent turns. Ideal when every question requires visual inspection across arbitrary pages, but incurs high ongoing cache maintenance costs.',
      case2Title: 'Case 2: Iterative Page Images by Tool (Multi-Step ReAct)',
      case2Desc: 'No pages are loaded upfront. The agent executes k tool calls sequentially per question, retrieving p page images each time. Because each step re-sends accumulating context, the sequential ReAct loop multiplies cached token read fees.',
      case3Title: 'Case 3: All Text Upfront + On-Demand Image Tool',
      case3Desc: 'PDF is parsed into text once and injected upfront (e.g. 500 tokens/page instead of 2,000). The model reasons over full text, and triggers exactly 1 tool call to inspect original page images when granular visual or layout detail is needed.',
      case4Title: 'Case 4: Iterative Text + On-Demand Image Tool',
      case4Desc: 'Zero upfront ingestion. The model searches text pages iteratively using k lightweight tool calls, followed by 1 targeted page image inspection tool call. Minimizes cold-start cost while maintaining high precision.',
      tableTitle: 'Architectural Comparison Matrix',
      colCase: 'Architecture',
      colStrategy: 'Ingestion Strategy',
      colToolCallsPerQ: 'Tool Calls / Question',
      colContextPattern: 'Context Growth Pattern',
      colIdealFor: 'Best Suited For',
      insightTitle: 'Key Engineering Takeaways',
      insight1Title: 'Text Parsing Delivers Massive Cache Leverage',
      insight1Desc: 'Parsing PDF to text cuts baseline document tokens by 75% (e.g. 500 tokens/pg vs 2,000 tokens/pg). Maintaining text in context cache is dramatically cheaper than caching raw page images.',
      insight2Title: 'Hybrid Text + Targeted Image Inspection Wins',
      insight2Desc: 'Case 3 (All Text + 1 Image Tool) frequently emerges as the optimal sweet spot: instant text comprehension across the entire document combined with surgical visual verification.',
      insight3Title: 'Sequential Tool Loops Compound Context Costs',
      insight3Desc: 'In multi-step agent loops, every additional tool call requires an LLM invocation that resends all prior context. Even with an 80% cache discount, 3+ tool calls per turn can exceed upfront text caching.',
    },
  },
  zh: {
    header: {
      title: '大模型长文档摄入成本对比分析仪',
      subtitle: '模拟全量图像预加载、逐次图像工具检索、全量文本+图像工具、逐次文本+图像工具 4 种架构在上下文缓存下的支出表现。',
      langSelect: '语言',
      badgeDoc: '文档：{pages} 页',
      badgeCache: '缓存：省 {discount}%（支付 {pay}%）',
      badgeQuestions: '共 {count} 轮问答',
      resetTitle: '重置所有参数为默认值',
    },
    common: {
      reset: '重置',
      case1Name: '方案 1：全量图像预加载',
      case2Name: '方案 2：逐次图像工具检索',
      case3Name: '方案 3：全量文本预加载 + 图像工具',
      case4Name: '方案 4：逐次文本检索 + 图像工具',
      case1Short: '方案 1：全量图像',
      case2Short: '方案 2：逐次图像',
      case3Short: '方案 3：文本+图像工具',
      case4Short: '方案 4：逐次文本+图像',
      questions: '轮问答',
      tokens: 'Token',
      pages: '页',
      call: '次调用',
      calls: '次调用',
      turn: '轮次',
      cost: '成本',
      savings: '节省',
      rank: '排名',
      winner: '最具成本效益',
      images: '张图片',
    },
    metrics: {
      winnerTitle: '全流程最佳成本架构',
      winnerDesc: '在完成全部 {totalQuestions} 轮问答的完整生命周期中，累计 API 支出最低。',
      lowestCostLabel: '最低总花费：',
      highestCostLabel: '最高总花费：',
      costSpreadLabel: '最大差距：',
      rankingTitle: '累计成本排行榜（第 {q} 轮）',
      turn1CostTitle: '首轮冷启动成本',
      finalTurnCostTitle: '末轮（第 {q} 轮）单轮边际成本',
      contextFootprintTitle: '最终上下文长度',
      contextFootprintDesc: '常驻于显存/缓存中的总 Token 量，作为后续轮次的缓存输入计费。',
    },
    params: {
      title: '仿真控制面板',
      subtitle: '调节文档体量、模态 Token 开销、多模态检索次数以及模型定价阶梯。',
      presetsLabel: '主流模型预设与缓存折扣',
      input: '输入',
      output: '输出',
      cacheDiscount: '缓存折扣',
      off: '折',
      providerAll: '全部厂商',
      secDoc: '文档规格与模态参数',
      secMessage: '交互消息与工具调用 Token',
      secPricing: '模型定价与上下文缓存率',
      totalPagesLabel: '文档总页数（N）',
      imageTokensPerPageLabel: '每页图像 Token 数',
      textTokensPerPageLabel: '每页文本解析 Token 数（OCR/解析）',
      imagesReadPerQLabel: '每轮查看图像页数',
      imagesReadPerQDesc: '方案 3 与方案 4 中每轮深入查看原图的页数',
      pagesPerToolLabel: '单次工具读取页数（p）',
      toolCallsPerQLabel: '每轮页面检索工具调用次数（k）',
      toolCallsHeadToHeadDesc: '对等设定：方案 2 中这 k 次调用获取图像页面；方案 4 中这 k 次调用获取文本页面（外加 1 次图像调用），保证同口径对照。',
      readSpeed: '全文档读取速率',
      questionsToRead: '读完所需问答轮数',
      syncEqual: '等长锁定模式',
      syncIndependent: '独立配置模式',
      syncTitle: '同步调节问题、工具与回答 Token',
      tokensPerQ: '用户提问 Token（T_q）',
      tokensPerTool: '工具调用开销 Token（T_tc）',
      tokensPerAns: '模型回答 Token（T_a）',
      sysPromptTokens: '系统提示词 Token（S）',
      modelInputPrice: '未缓存输入单价（$/1M Tokens）',
      modelOutputPrice: '输出单价（$/1M Tokens）',
      cacheDiscountRate: '上下文缓存折扣率',
      cachedBilledAt: '命中缓存仅按标准价格的 {rate}% 计费',
      customQuestionsTitle: '模拟总问答轮数',
      customQuestionsAuto: '自动（{count} 轮读完全文）',
      customQuestionsCustom: '自定义轮数',
    },
    charts: {
      tabCumulative: '累计总成本（$）',
      tabMarginal: '单轮边际成本（$）',
      tabContext: '上下文增长曲线',
      tabBreakdown: 'Token 构成分布',
      cumTitle: '四种架构累计支出对比曲线',
      cumSubtitle: '在上下文持续累积及 80% 缓存折扣条件下的全流程美元总支出。',
      marginalTitle: '每轮独立边际成本（$/轮）',
      marginalSubtitle: '随轮次推进，每回答一个问题实际产生的即时 API 账单。',
      contextTitle: '上下文窗口增长趋势',
      contextSubtitle: '保留在对话历史中并在下一轮作为缓存输入复用的总 Token 规模。',
      breakdownTitle: '各部分 Token 构成占比',
      breakdownSubtitle: '展示系统词、提问、工具调用、文本/图像文档内容与回答的结构分布。',
      legendC1: '方案 1：全量图像预加载',
      legendC2: '方案 2：逐次图像工具检索',
      legendC3: '方案 3：全量文本预加载 + 图像工具',
      legendC4: '方案 4：逐次文本检索 + 图像工具',
      legendSysPrompt: '系统提示词',
      legendQuestions: '用户提问',
      legendToolCalls: '工具调用',
      legendDoc: '文档内容（文本/图像）',
      legendDocImages: '文档图像 Token',
      legendDocText: '文档文本 Token',
      legendAnswers: '回答生成',
      questionSliderLabel: '选择问答轮次',
      breakdownTurnMode: '本轮单问 Q{q}（该问全步骤累加）',
      breakdownCumulativeMode: '全局累计（Q1 至 Q{q}）',
      breakdownSubtitleAccumulated: '展示在第 Q{q} 轮中所有模型调用步骤（包含工具往返）实际处理消耗的 Token 构成。',
      totalTokensAtQ: '第 {q} 轮处理总 Token',
      xAxisQuestion: '问答轮次',
      yAxisCost: '支出（美元）',
      yAxisTokens: 'Token 数量',
      curveSmooth: '平滑曲线',
      curveLinear: '折线精确',
      exportBtn: '导出图表',
      exportPng: 'PNG 高清图片 (.png)',
      exportSvg: 'SVG 矢量图形 (.svg)',
      exporting: '正在导出...',
      legendTitle: '架构方案图例',
      legendToggle: '点击切换显隐',
      c1Sub: '首轮全量载入文档图像',
      c2Sub: '每轮 {calls} 次图像页面工具调用',
      c3Sub: '全文预载入 + 1 次原图核查',
      c4Sub: '每轮 {calls} 次文本调用 + 1 次原图核查',
      cacheDiscountFootnote: '缓存折扣率：',
      retrievalParityFootnote: '对等检索设定：',
      callsPerQ: '次调用/轮',
    },
    table: {
      title: '逐轮成本账本台账',
      subtitle: '全面追踪 4 种方案在每一轮问答中的单轮花费与累计金额。',
      colQuestion: '轮次',
      colC1: '方案 1（全量图像）',
      colC2: '方案 2（逐次图像）',
      colC3: '方案 3（文本+图像）',
      colC4: '方案 4（逐次文本+图像）',
      colWinner: '当轮最低花费',
      searchPlaceholder: '搜索问答轮次...',
    },
    explainer: {
      title: '4 种文档处理架构深度解析与对比',
      subtitle: '全面评估 Token 占用、缓存效益与多模态图文协同的技术取舍。',
      case1Title: '方案 1：全量图像预加载（Pure Image Ingestion）',
      case1Desc: '在第 1 轮将全部 N 页图像直接读入上下文。后续提问无需执行任何工具调用。当每一轮都需任意跨页检索复杂图表排版时体验最佳，但持续占用高昂的图像缓存空间。',
      case2Title: '方案 2：逐次图像工具检索（Multi-Step ReAct）',
      case2Desc: '前端零预加载。每轮由 Agent 顺序执行 k 次工具调用，每次读取 p 页图像。由于 ReAct 循环每一步都重新传递不断膨胀的历史，多步调用放大了缓存读取成本。',
      case3Title: '方案 3：全量文本预加载 + 原图按需检索（Text + Image Tool）',
      case3Desc: '先将 PDF 解析提取为轻量文本预先载入（如每页仅 500 Token，相比原图 2000 Token 减少 75%）。模型在全文语义理解基础上，每轮仅在必要时调用 1 次工具查验原图。',
      case4Title: '方案 4：逐次文本检索 + 原图按需检索（Iterative Text + Image Tool）',
      case4Desc: '零首轮预热。每轮先通过 k 次轻量文本工具检索定位，再通过 1 次图像工具精准调取原图核实细节。兼具极低的冷启动成本与高精度核验。',
      tableTitle: '4 种架构特性对比矩阵',
      colCase: '方案架构',
      colStrategy: '内容载入策略',
      colToolCallsPerQ: '每轮工具调用',
      colContextPattern: '上下文累积特征',
      colIdealFor: '最佳适用场景',
      insightTitle: '核心工程洞察',
      insight1Title: '文本解析带来巨大的缓存杠杆',
      insight1Desc: '将 PDF 解析为文本能将基准文档体积缩减 75%（例如 500 Token/页 vs 2000 Token/页）。在长多轮对话中，维护文本缓存的成本远低于维护全量图像。',
      insight2Title: '混合架构（全量文本 + 原图工具）往往具备最佳性价比',
      insight2Desc: '方案 3 在许多场景中胜出：既保留了全局全文的即时交叉比对能力，又避免了全量高分辨率图像的常驻开销，仅对疑难点进行单次原图抽检。',
      insight3Title: '顺序工具循环会成倍叠加上下文开销',
      insight3Desc: '在多步 Agent 循环中，每次工具调用都是一次独立的 LLM 交互，必须重新传递所有已累积上下文。即便享有 80% 缓存折扣，单轮 3 次以上的调用仍可能反超全量文本缓存。',
    },
  },
  ja: {
    header: {
      title: 'LLM ドキュメント取り込みコスト比較シミュレーター',
      subtitle: '全ページ画像一括、順次画像ツール、全文テキスト+画像ツール、順次テキスト+画像ツールの4手法をコンテキストキャッシュ下でシミュレーション。',
      langSelect: '言語',
      badgeDoc: '文書: {pages} ページ',
      badgeCache: 'キャッシュ: {discount}% 引 (支払 {pay}%)',
      badgeQuestions: '全 {count} 質問完了',
      resetTitle: 'パラメーターを初期値にリセット',
    },
    common: {
      reset: 'リセット',
      case1Name: 'ケース 1: 全ページ画像一括読込',
      case2Name: 'ケース 2: 順次画像検索 (ツール)',
      case3Name: 'ケース 3: 全文テキスト一括 + 画像ツール',
      case4Name: 'ケース 4: 順次テキスト + 画像ツール',
      case1Short: 'C1: 全画像一括',
      case2Short: 'C2: 順次画像',
      case3Short: 'C3: テキスト+画像',
      case4Short: 'C4: 順次テキスト+画像',
      questions: '問',
      tokens: 'トークン',
      pages: 'ページ',
      call: '回',
      calls: '回',
      turn: 'ターン',
      cost: 'コスト',
      savings: '削減',
      rank: '順位',
      winner: '最安アーキテクチャ',
      images: '枚の画像',
    },
    metrics: {
      winnerTitle: '最も費用対効果の高いアーキテクチャ',
      winnerDesc: '全 {totalQuestions} 回の質問完了までにおける累積 API 費用が最も安価です。',
      lowestCostLabel: '最安コスト:',
      highestCostLabel: '最高コスト:',
      costSpreadLabel: '最大格差:',
      rankingTitle: '累積コストランキング (第 {q} 問)',
      turn1CostTitle: '第 1 ターン初期読込コスト',
      finalTurnCostTitle: '最終ターン限界コスト',
      contextFootprintTitle: '最終コンテキスト保持量',
      contextFootprintDesc: '後続ターンでキャッシュ入力として課金されるメモリ保持トークン総量。',
    },
    params: {
      title: 'シミュレーション設定',
      subtitle: 'ドキュメント規模、トークン配分、画像取得頻度、モデル料金を設定します。',
      presetsLabel: 'モデルプリセットとキャッシュ価格',
      input: '入力',
      output: '出力',
      cacheDiscount: 'キャッシュ割引',
      off: '引',
      providerAll: 'すべてのプロバイダ',
      secDoc: 'ドキュメントとモダリティ設定',
      secMessage: 'メッセージとツールのトークン量',
      secPricing: 'モデル単価とキャッシュ割引率',
      totalPagesLabel: '文書総ページ数 (N)',
      imageTokensPerPageLabel: '1ページあたりの画像トークン',
      textTokensPerPageLabel: '1ページあたりのテキストトークン (OCR/解析)',
      imagesReadPerQLabel: '1問あたり確認する画像ページ数',
      imagesReadPerQDesc: 'ケース 3 および 4 において元画像を確認する枚数',
      pagesPerToolLabel: 'ツール1回の読込ページ数 (p)',
      toolCallsPerQLabel: '1問あたりのページ検索ツール呼出回数 (k)',
      toolCallsHeadToHeadDesc: '厳密な対等比較：ケース2ではこのk回が画像ページの取得、ケース4ではこのk回がテキストページの取得（＋1回の画像呼出）に対応します。',
      readSpeed: '文書読破ペース',
      questionsToRead: '読破に必要な質問数',
      syncEqual: 'トークン数同期モード',
      syncIndependent: '個別設定モード',
      syncTitle: '質問・ツール・回答のトークン数を揃える',
      tokensPerQ: '質問トークン (T_q)',
      tokensPerTool: 'ツール呼出ヘッダー (T_tc)',
      tokensPerAns: '回答トークン (T_a)',
      sysPromptTokens: 'システムプロンプト (S)',
      modelInputPrice: '入力単価 ($ / 100万トークン)',
      modelOutputPrice: '出力単価 ($ / 100万トークン)',
      cacheDiscountRate: 'コンテキストキャッシュ割引率',
      cachedBilledAt: 'キャッシュ適用時は通常単価の {rate}% で課金',
      customQuestionsTitle: '評価質問数の指定',
      customQuestionsAuto: '自動 ({count} 問で完読)',
      customQuestionsCustom: '質問数を直接指定',
    },
    charts: {
      tabCumulative: '累積コスト ($)',
      tabMarginal: '各ターンの限界コスト ($)',
      tabContext: 'コンテキスト長推移',
      tabBreakdown: 'トークン構成比',
      cumTitle: '4手法の累積費用推移',
      cumSubtitle: 'コンテキスト累積およびキャッシュ割引適用下での総費用比較。',
      marginalTitle: '1問ごとの限界費用 ($/ターン)',
      marginalSubtitle: '質問ごとの個別の API 課金額推移。',
      contextTitle: 'コンテキスト長累積推移',
      contextSubtitle: '会話履歴に蓄積され次ターンでキャッシュ入力となるトークン量。',
      breakdownTitle: 'トークン構成内訳',
      breakdownSubtitle: 'プロンプト、質問、ツール、テキスト、画像、回答の内訳。',
      legendC1: 'ケース 1: 全画像一括読込',
      legendC2: 'ケース 2: 順次画像検索 (ツール)',
      legendC3: 'ケース 3: 全文テキスト一括 + 画像ツール',
      legendC4: 'ケース 4: 順次テキスト + 画像ツール',
      legendSysPrompt: 'システムプロンプト',
      legendQuestions: '質問',
      legendToolCalls: 'ツール呼出',
      legendDoc: '文書内容 (テキスト/画像)',
      legendDocImages: '文書画像トークン',
      legendDocText: '文書テキストトークン',
      legendAnswers: '回答',
      questionSliderLabel: '質問ターンを選択',
      breakdownTurnMode: '該当問 Q{q}（全ステップ合算）',
      breakdownCumulativeMode: '累計（Q1〜Q{q}）',
      breakdownSubtitleAccumulated: '質問 Q{q} 内で発生した全ツール呼出・往復ステップで処理されたトークン内訳。',
      totalTokensAtQ: 'Q{q} 処理トークン総数',
      xAxisQuestion: '質問ターン',
      yAxisCost: '費用 (USD)',
      yAxisTokens: 'トークン',
      curveSmooth: 'スプライン曲線',
      curveLinear: '折線グラフ',
      exportBtn: 'ビジュアル出力',
      exportPng: 'PNG 画像 (.png)',
      exportSvg: 'SVG ベクター (.svg)',
      exporting: '出力中...',
      legendTitle: 'アーキテクチャ凡例',
      legendToggle: '表示切替',
      c1Sub: '全ページ画像を事前読込',
      c2Sub: '1問あたり {calls} 回の画像ツール呼出',
      c3Sub: '全文テキスト + 1回画像確認',
      c4Sub: '1問あたり {calls} 回テキスト + 1回画像',
      cacheDiscountFootnote: 'キャッシュ割引：',
      retrievalParityFootnote: '対等検索条件：',
      callsPerQ: '回/問',
    },
    table: {
      title: 'ターン別数値台帳',
      subtitle: '全4手法の各ターンにおける費用とコンテキスト推移の一覧。',
      colQuestion: 'ターン',
      colC1: 'ケース 1 (全画像)',
      colC2: 'ケース 2 (順次画像)',
      colC3: 'ケース 3 (テキスト+画像)',
      colC4: 'ケース 4 (順次テキスト+画像)',
      colWinner: '最安ケース',
      searchPlaceholder: 'ターンを検索...',
    },
    explainer: {
      title: '4 つのドキュメント処理アーキテクチャ詳細比較',
      subtitle: 'トークンフットプリント、キャッシュ効率、マルチモーダル検証のトレードオフ分析。',
      case1Title: 'ケース 1: 全ページ画像一括読込 (Pure Image Ingestion)',
      case1Desc: '第1ターンで全Nページの画像をコンテキストに読込。後続ターンでのツール呼出は不要。全ページを俯瞰する必要がある場合に有利ですが、画像キャッシュの保持費用が継続します。',
      case2Title: 'ケース 2: 順次画像検索 (Multi-Step ReAct)',
      case2Desc: '事前読込なし。毎ターン Agent が k 回ツールを呼び出し、p ページずつ画像を取得。ReAct ループの各ステップで蓄積コンテキストが再送信されるためコストが累積します。',
      case3Title: 'ケース 3: 全文テキスト一括 + 画像確認ツール (Text + Image Tool)',
      case3Desc: 'PDF をテキストとして抽出し一括読込 (画像比で約75%軽量化)。全文コンテキストで推論しつつ、細部の図表確認が必要な場合のみ1回画像ツールを実行します。',
      case4Title: 'ケース 4: 順次テキスト検索 + 画像確認ツール (Iterative Text + Image Tool)',
      case4Desc: '事前読込ゼロ。k 回の軽量テキスト検索で該当箇所を絞り込み、最後に1回画像ツールで元画像を確認。初期コストを最小化しつつ高精度な検証が可能です。',
      tableTitle: 'アーキテクチャ特性比較表',
      colCase: '手法',
      colStrategy: '取り込み戦略',
      colToolCallsPerQ: '1問あたりツール呼出',
      colContextPattern: 'コンテキスト蓄積特性',
      colIdealFor: '最適ユースケース',
      insightTitle: 'エンジニアリング視点の重要ポイント',
      insight1Title: 'テキスト解析による圧倒的なキャッシュ効率',
      insight1Desc: 'PDF をテキスト化することで基礎トークン量を大幅に抑制 (例: 500 トークン/頁 vs 2000 トークン/頁)。テキストのキャッシュ保持コストは画像に比べ格段に安価です。',
      insight2Title: 'ハイブリッド手法 (全文テキスト + 画像確認) の費用対効果',
      insight2Desc: 'ケース 3 は多くのケースで最安水準となります。全文検索の即応性を保ちつつ、高解像度画像の常駐を防ぎ、必要なページのみ画像を取得します。',
      insight3Title: '順次ツールループにおけるコンテキストの累積増幅',
      insight3Desc: 'マルチステップの Agent ループでは、ツール呼出ごとにコンテキスト全体が再送信されます。80%のキャッシュ割引があっても、3回以上の呼出が重なると一括テキスト読込を上回る場合があります。',
    },
  },
};
