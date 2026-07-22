// Claude API 호출 서비스.
//
// API 키가 환경변수로 제공되면 실제 API를 호출한다.
// 키가 없으면 Mock 모드로 동작하여, 개발/체크 단계에서도 전체 파이프라인을 테스트할 수 있다.
//
// 개발 환경(npm run dev): vite 프록시(/api/anthropic)를 통해 요청
// StackBlitz/프로덕션: 환경변수로 키가 제공되면 브라우저 직접 호출

import { parseLLMJson } from "../utils/jsonParser.js";



// -----------------------------------------------------------------------------
// AI IMPROVEMENT PROMPT STRATEGIES
// -----------------------------------------------------------------------------
// 현재 StackBlitz/개발 환경에서는 API 키가 없으면 기존 Mock 엔진을 사용합니다.
// 추후 Claude API를 연결할 때는 아래 전략을 그대로 프롬프트에 포함하면 됩니다.
// 이 상수는 현재 Mock 동작에 영향을 주지 않으며 API 연결 준비용입니다.
export const AI_IMPROVEMENT_PROMPT_STRATEGIES = {
  conversion: {
    id: 'conversion',
    label: '구매 전환형',
    role: '고객의 구매 결정을 돕는 세일즈 카피라이터',
    instruction: `
고객의 구매 결정을 돕는 세일즈 카피로 개선한다.
- 핵심 구매 이유를 먼저 제시한다.
- 제품 선택 기준과 차별점을 분명하게 한다.
- 추상적인 감성 표현보다 구체적인 이점을 강조한다.
- 과도한 명령형, 할인, 긴급성, 허위 효능 표현은 사용하지 않는다.
- 원문과 제품 정보에 없는 사실은 만들지 않는다.
`.trim(),
  },
  premium: {
    id: 'premium',
    label: '브랜드 고급화형',
    role: '절제된 언어를 사용하는 프리미엄 브랜드 카피라이터',
    instruction: `
제품 정보를 고급스럽고 절제된 브랜드 언어로 개선한다.
- 과장하지 않고 여백 있는 문장으로 작성한다.
- 브랜드의 태도와 기준이 느껴지게 한다.
- 비싸 보이기 위한 표현보다 신뢰와 완성도를 전달한다.
- 존재하지 않는 브랜드 철학, 역사, 가치관을 만들지 않는다.
- 원문의 핵심 정보는 유지한다.
`.trim(),
  },
  professional: {
    id: 'professional',
    label: '전문 신뢰형',
    role: '객관적인 제품 정보를 명확히 전달하는 전문 카피라이터',
    instruction: `
객관적인 제품 정보를 중심으로 전문성과 신뢰를 높인다.
- 원료, 함량, 제형, 제조, 검사, 섭취 기준 등 제공된 정보만 활용한다.
- 모호한 우수성 표현을 구체적인 확인 기준으로 바꾼다.
- 임상, 인증, 시험 결과가 입력되지 않았다면 생성하지 않는다.
- 질병 예방·치료 및 검증되지 않은 효능 표현을 사용하지 않는다.
- 감성 문구보다 정확성과 가독성을 우선한다.
`.trim(),
  },
  concise: {
    id: 'concise',
    label: '핵심 압축형',
    role: '핵심 의미를 짧고 정확하게 압축하는 카피 에디터',
    instruction: `
원문의 핵심 의미만 남겨 제목과 본문을 간결하게 압축한다.
- 제목은 8~15자로 작성한다.
- 본문은 원문 길이의 40~60%를 목표로 한다.
- 단어를 기계적으로 자르지 말고 완전한 한국어 문장으로 재작성한다.
- 핵심 정보와 제품 선택 이유는 유지한다.
- 새로운 사실이나 표현을 추가하지 않는다.
`.trim(),
  },
  target: {
    id: 'target',
    label: '타깃 맞춤형',
    role: '입력된 타깃 고객의 상황을 정확히 이해하는 카피라이터',
    instruction: `
입력된 타깃 고객이 자신의 상황이라고 느낄 수 있도록 개선한다.
- 반드시 실제 입력된 타깃 고객 정보만 사용한다.
- 타깃 정보가 없다면 직업, 나이, 성별, 생활 장면을 임의로 만들지 않는다.
- 타깃의 고민과 제품 정보 사이의 연결을 자연스럽게 표현한다.
- 과장된 공감 표현이나 불안 자극은 사용하지 않는다.
- 제품이 문제를 해결한다고 단정하지 않는다.
`.trim(),
  },
};

const COMMON_AI_IMPROVEMENT_RULES = `
선택한 옵션의 목적이 제목과 본문에서 분명하게 드러나야 한다.
다른 옵션과 동일한 제목 또는 사실상 동일한 본문을 반환하지 않는다.
단순 조사 변경, 문법 수정, 유사어 치환만으로 끝내지 않는다.
원문에 없는 제품 정보, 효능, 인증, 수치, 브랜드 철학은 생성하지 않는다.
입력된 사실이 부족하면 추측하지 말고 제공된 정보 범위 안에서만 작성한다.
반드시 자연스럽고 완전한 한국어 문장으로 작성한다.
`.trim();

export function buildAIImprovementPrompt({
  option,
  section,
  product = {},
  customInstruction = '',
}) {
  const strategy =
    AI_IMPROVEMENT_PROMPT_STRATEGIES[option] ||
    AI_IMPROVEMENT_PROMPT_STRATEGIES.conversion;

  const safeSection = section || {};
  const targetCustomer =
    product.targetCustomer || product.target || product.audience || '';

  return `
[역할]
${strategy.role}

[선택한 개선 방식]
${strategy.label}

[옵션별 지시]
${strategy.instruction}

[공통 규칙]
${COMMON_AI_IMPROVEMENT_RULES}

[제품 정보]
제품명: ${product.name || product.productName || ''}
카테고리: ${product.category || ''}
타깃 고객: ${targetCustomer}
제품 특징: ${product.features || product.strengths || product.description || ''}

[현재 섹션]
제목: ${safeSection.title || ''}
본문: ${safeSection.body || ''}
항목: ${JSON.stringify(safeSection.items || [])}

[사용자 추가 요청]
${customInstruction || '없음'}

[출력 형식]
설명 없이 아래 JSON 형식만 반환한다.
{
  "title": "개선된 제목",
  "body": "개선된 본문",
  "items": []
}
`.trim();
}

const API_ENDPOINT = "/api/anthropic";
const MODEL = import.meta.env.VITE_ANTHROPIC_MODEL || "claude-sonnet-4-6";
const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || "";

// Mock 생성용 템플릿 데이터
// ✅ 개선: section을 "개선"하지, 새로운 글을 쓰지 않습니다
function generateMockDraft(product = {}, instruction = "", section = {}) {
  const targetCustomer = String(product.targetCustomer || product.target || "").trim();
  const instructionLower = String(instruction || "").toLowerCase();
  const isConversion = instructionLower.includes("세일즈 카피라이터") || instructionLower.includes("고객의 구매 결정");
  const isPremium = instructionLower.includes("프리미엄 브랜드 카피") || instructionLower.includes("브랜드의 가치와 철학");
  const isProfessional = instructionLower.includes("제품 기획자") || instructionLower.includes("객관적 우수성");
  const isConcise = instructionLower.includes("모바일 ux") || instructionLower.includes("50% 이하로 압축");
  const isTarget = instructionLower.includes("타깃 전문 마케터") || instructionLower.includes("깊은 공감과 연결");

  const originalTitle = String(section?.title || "").trim();
  const originalBody = String(section?.body || "").trim();
  const originalItems = Array.isArray(section?.items) ? section.items : [];

  const keepOriginal = (reason) => ({
    title: originalTitle,
    body: originalBody,
    items: originalItems,
    improvement_reason: reason,
  });

  const fixGrammar = (text) => String(text || "")
    .replace(/구성했는지을+/g, "구성했는지")
    .replace(/어떤\s+기준으로\s+구성했는지\s*을/g, "어떤 기준으로 구성했는지")
    .replace(/을\s+을\s+/g, "을 ")
    .replace(/를\s+를\s+/g, "를 ")
    .replace(/\s{2,}/g, " ")
    .trim();

  const finishSentence = (text) => {
    const value = String(text || "").trim().replace(/[.。]+$/, "");
    return value ? `${value}.` : "";
  };

  if (isConversion) {
    if (!originalBody) return keepOriginal("개선할 원문이 없어 기존 내용을 유지했습니다.");
    let improvedTitle = originalTitle;
    if (improvedTitle) {
      const keywordMatch = improvedTitle.match(/^([가-힣\w]+)/);
      if (keywordMatch) improvedTitle = `${keywordMatch[1]}을 확인해야 하는 이유`;
    }
    let improvedBody = originalBody
      .replace(/원료를[^.]*?구성했는지을[^.]*?을\s*더\s*분명/g, "원료를 살펴보면 제품의 설계 방향과 선택 기준을 더 분명")
      .replace(/구성했는지을/g, "구성된")
      .replace(/담은\s*원료/g, "구성된 원료")
      .replace(/알\s*수\s*있습니다/g, "확인할 수 있습니다")
      .replace(/을\s*사용해\s*/g, "을 사용하여 ")
      .replace(/를\s*사용해\s*/g, "를 사용하여 ");
    return { title: improvedTitle, body: improvedBody, items: originalItems, improvement_reason: "구매 선택 기준이 명확하게 드러나도록 개선했습니다." };
  }

  if (isPremium) {
    if (!originalBody) return keepOriginal("개선할 원문이 없어 기존 내용을 유지했습니다.");
    let refinedTitle = fixGrammar(originalTitle);
    const titleMatch = refinedTitle.match(/^(.+?)\s*구성이\s*(.+?)을\s*보여줍니다$/);
    if (titleMatch) refinedTitle = `${titleMatch[1]}에서 드러나는 ${titleMatch[2]}`;
    let refinedBody = fixGrammar(originalBody)
      .replace(/담은\s+원료/g, "구성된 원료")
      .replace(/더\s*분명하게\s*알\s*수\s*있습니다/g, "더 자연스럽게 이해할 수 있습니다")
      .replace(/알\s*수\s*있습니다/g, "이해할 수 있습니다");
    return { title: refinedTitle || originalTitle, body: refinedBody || originalBody, items: originalItems, improvement_reason: "원문의 의미를 유지하면서 표현을 정제했습니다." };
  }

  if (isProfessional) {
    if (!originalBody) return keepOriginal("개선할 원문이 없어 기존 내용을 유지했습니다.");
    let objectiveTitle = fixGrammar(originalTitle);
    const titleMatch = objectiveTitle.match(/^(.+?)\s*구성이\s*(.+?)을\s*보여줍니다$/);
    if (titleMatch) objectiveTitle = `${titleMatch[1]} 구성에서 확인할 수 있는 기준`;
    let objectiveBody = fixGrammar(originalBody)
      .replace(/담은\s+원료/g, "구성된 원료")
      .replace(/더\s*분명하게\s*알\s*수\s*있습니다/g, "더 명확하게 확인할 수 있습니다")
      .replace(/\s+(매우|정말)\s+/g, " ");
    return { title: objectiveTitle || originalTitle, body: objectiveBody || originalBody, items: originalItems, improvement_reason: "문법을 교정하고 객관적으로 정리했습니다." };
  }

  if (isConcise) {
    if (!originalBody) return keepOriginal("개선할 원문이 없어 기존 내용을 유지했습니다.");
    let compressedTitle = "";
    if (/배합|구성/.test(originalTitle)) compressedTitle = "배합 구성의 기준";
    else if (/원료/.test(originalTitle)) compressedTitle = "원료 선택의 기준";
    else if (/제품/.test(originalTitle)) compressedTitle = "제품 선택의 기준";
    else {
      const core = originalTitle.replace(/(보여줍니다|알려줍니다|확인합니다|입니다|합니다)[.!?]?$/g, "").trim();
      compressedTitle = core ? `${core.slice(0, 7)} 핵심` : "핵심 내용의 기준";
    }
    if (compressedTitle.length < 8) compressedTitle = `${compressedTitle} 한눈에`;
    if (compressedTitle.length > 15) compressedTitle = compressedTitle.slice(0, 15).trim();

    const cleanBody = fixGrammar(originalBody).replace(/담은\s+원료/g, "구성된 원료");
    let compressedBody;

    // 핵심 의미를 완전한 문장으로 재구성한다. 단어를 임의로 잘라 붙이지 않는다.
    if (/주원료와 함께 구성된 원료/.test(cleanBody) && /제품의 (설계 )?방향/.test(cleanBody)) {
      compressedBody = "배합 기준으로 제품의 방향을 확인할 수 있습니다";
    } else if (/주원료와 함께 구성된 원료/.test(cleanBody)) {
      compressedBody = "배합 구성을 간결하게 확인할 수 있습니다";
    } else if (/선택 기준/.test(cleanBody)) {
      compressedBody = "핵심 선택 기준을 확인할 수 있습니다";
    } else {
      const clauses = cleanBody
        .split(/[.?!]|[,，]|(?:고\s)|(?:며\s)/)
        .map((value) => value.trim())
        .filter(Boolean);
      const coreClause = clauses.find((value) => value.length >= 8) || clauses[0] || cleanBody;
      compressedBody = coreClause
        .replace(/더\s*(분명하게|명확하게|자연스럽게)/g, "")
        .replace(/알\s*수\s*있습니다/g, "확인할 수 있습니다")
        .replace(/\s{2,}/g, " ")
        .trim();
      if (!/(습니다|입니다|합니다|됩니다|있습니다)$/.test(compressedBody)) {
        compressedBody = `${compressedBody} 확인할 수 있습니다`;
      }
    }
    compressedBody = finishSentence(compressedBody);
    return { title: compressedTitle, body: compressedBody, items: originalItems, improvement_reason: "핵심 의미를 유지한 완전한 문장으로 압축했습니다." };
  }

  if (isTarget) {
    if (!originalBody) return keepOriginal("개선할 원문이 없어 기존 내용을 유지했습니다.");
    if (!targetCustomer) return keepOriginal("타깃 정보가 없어 기존 내용을 유지했습니다.");
    const cleanBody = fixGrammar(originalBody);
    const targetedBody = `타깃 고객인 ${targetCustomer}을 기준으로, ${cleanBody}`;
    return { title: originalTitle, body: targetedBody, items: originalItems, improvement_reason: "입력된 타깃 정보만 반영했습니다." };
  }

  return keepOriginal("적용할 개선 옵션이 없어 기존 내용을 유지했습니다.");
}

function generateMockCompliance() {
  return {
    overall_status: "pass",
    severity_count: { critical: 0, warning: 0, info: 0 },
    flags: [],
    summary: "컴플라이언스 체크가 완료되었습니다 (Mock 모드).",
  };
}

// 실제 API 호출 (키가 있을 때)
async function callClaudeApi(prompt, maxTokens = 2000) {
  let endpoint = API_ENDPOINT;
  let headers = { "Content-Type": "application/json" };
  let body = JSON.stringify({
    model: MODEL,
    max_tokens: maxTokens,
    messages: [{ role: "user", content: prompt }],
  });

  // StackBlitz 등 프로덕션 환경에서 API 키가 있으면 직접 호출
  if (API_KEY && typeof window !== "undefined" && window.location.origin.includes("stackblitz")) {
    endpoint = "https://api.anthropic.com/v1/messages";
    headers = {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    };
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers,
    body,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(`API 오류 (${res.status}): ${data?.error?.message || JSON.stringify(data)}`);
  }

  const text = (data.content || []).map((b) => (b.type === "text" ? b.text : "")).join("\n");

  if (!text) {
    throw new Error("응답에 텍스트 내용이 없어요: " + JSON.stringify(data));
  }

  return parseLLMJson(text);
}

/**
 * Claude에 프롬프트를 보내고, JSON으로 파싱된 결과를 반환한다.
 * API 키가 없으면 Mock 모드로 동작한다.
 *
 * @param {string} prompt - 사용자 프롬프트
 * @param {number} maxTokens - 최대 출력 토큰
 * @param {object} context - Mock 모드용 컨텍스트 (product 등)
 * @param {string} stage - Mock 모드 스테이지 ("generation" | "compliance" | "remediation" | "regenerate")
 * @returns {Promise<object>} 파싱된 JSON 객체
 */
export async function callClaude(prompt, maxTokens = 2000, context = {}, stage = "generation") {
  // API 키 없으면 Mock 모드
  if (!API_KEY) {
    // 시뮬레이션 딜레이 (실제 API 호출처럼 보이도록)
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 400));

    // 스테이지별 Mock 응답
    if (stage === "compliance") {
      return generateMockCompliance();
    }
    // ✅ 수정: instruction과 section을 generateMockDraft에 전달
    if (stage === "remediation" || stage === "regenerate") {
      return generateMockDraft(context.product || {}, context.instruction || "", context.section || {});
    }
    // generation, 기타 스테이지
    return generateMockDraft(context.product || {}, context.instruction || "", context.section || {});
  }

  // API 키가 있으면 실제 호출
  return callClaudeApi(prompt, maxTokens);
}
