import { buildImprovePrompt } from "./improvePromptEngine";
import { buildAIImprovementPrompt, callClaude } from "../../services/claudeClient";

export function runAIImproveEngine({section={}, productInfo={}, category="", targetCustomer="", brainKnowledge={}, tone="", instruction=""}={}) {
  const prompt = buildImprovePrompt({section, productInfo, category, targetCustomer, brainKnowledge, tone, instruction});

  return {
    prompt,
    result: {
      title: `${section.title || ""}${instruction ? ` (${instruction})` : ""}`,
      body: section.body || "",
      generatedBy: "aiImproveEngine"
    }
  };
}


export async function runAIImproveEngineAsync({
  section = {},
  productInfo = {},
  category = "",
  targetCustomer = "",
  brainKnowledge = {},
  tone = "",
  instruction = "",
  option = ""
} = {}) {

  // API 연결 시에는 옵션별 전용 프롬프트를 사용한다.
  // API 키가 없는 현재 환경에서는 callClaude 내부에서 기존 Mock 엔진으로 안전하게 분기한다.
  const normalizedProduct = {
    ...productInfo,
    category: category || productInfo?.category || productInfo?.mainCategory || "",
    targetCustomer:
      targetCustomer ||
      productInfo?.targetCustomer ||
      productInfo?.target ||
      productInfo?.audience ||
      "",
  };

  const prompt = buildAIImprovementPrompt({
    option,
    section,
    product: normalizedProduct,
    customInstruction: instruction,
  });

  const result = await callClaude(
    prompt,
    1200,
    {
      product: normalizedProduct,
      section,
      instruction,
      option,
    },
    "regenerate"
  );

  return {
    prompt,
    result: {
      title: result?.title || result?.hero_headline || result?.sections?.[0]?.title || section.title || "",
      body: result?.body || result?.hero_subcopy || result?.sections?.[0]?.body || section.body || "",
      items: result?.items || result?.sections?.[0]?.items || section.items || [],
      raw: result,
      generatedBy: "aiImproveEngineAsync"
    }
  };
}
