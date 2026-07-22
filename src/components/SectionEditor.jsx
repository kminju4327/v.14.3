import { useEffect, useMemo, useState } from "react";

const IMPROVEMENT_OPTIONS = [
  {
    id: "conversion",
    label: "🎯 구매 전환형",
    instruction: `당신은 세일즈 카피라이터입니다.
목표는 고객의 구매 결정을 만드는 것입니다.

[필수 구조 - 반드시 이 순서로]
1. 고객 고민: 고객이 왜 이 제품을 찾았는가?
   "많은 사람들이 _____ 고민을 합니다"
   
2. 선택 기준: 좋은 제품을 선택할 때 뭘 봐야하나?
   "_____ 기준으로 찾아야 합니다"
   
3. 제품 특징: 이 제품은 그 기준을 어떻게 충족하나?
   "이 제품은 _____ 때문에"
   
4. 구매 이유: 왜 지금 이 제품을 선택해야 하나?
   "선택한다면 _____"

[절대 금지]
- 다른 고객들이 선택했다는 표현
- 판매량, 판매 1위 언급
- 만족도, 고객 후기 생성
- 사회적 증거 활용
- 근거 없는 효능 표현

[문체]
확신 있고, 설득력 있고, 긍정적`,
    description: "고객의 구매 결정을 만드는 세일즈 카피.",
  },
  {
    id: "premium",
    label: "💎 브랜드 고급화형",
    instruction: `당신은 프리미엄 브랜드 카피라이터입니다.
목표는 브랜드의 가치와 철학을 표현하는 것입니다.

[필수 요소]
- 감정적 연결: 감정에 호소하되 우아하게
- 브랜드 철학: 왜 이 브랜드가 존재하는가?
- 문장 완성도: 마치 문학작품처럼 정제된 표현
- 세련된 톤: 고급스럽고 품격 있는 문체

[개선 방식]
1. 기존 내용을 브랜드 관점에서 재해석
2. 제품이 아닌 브랜드 경험 강조
3. 감각적이고 우아한 표현 사용
4. 고객과의 감정적 관계 형성

[절대 금지]
- "프리미엄" 단어 반복
- "고급" "럭셔리" 같은 직접적 표현
- 실제 없는 성분이나 인증 추가
- 과장된 표현

[문체]
우아하고, 감정적이고, 철학적`,
    description: "브랜드 가치를 감정으로 전달하는 카피.",
  },
  {
    id: "professional",
    label: "🔬 전문 신뢰형",
    instruction: `당신은 제품 기획자입니다.
목표는 제품의 객관적 우수성을 입증하는 것입니다.

[필수 순서 - 반드시 이 순서로]
1. 원료: 어떤 원료를 사용했는가?
2. 배합: 왜 이 원료들을 함께 사용했는가?
3. 품질: 어떤 기준으로 품질을 관리하는가?
4. 제조: 어떻게 만들어지는가?
5. 선택 이유: 이런 이유로 선택하면 좋습니다

[핵심 규칙]
- 제품 정보에 없는 항목은 "생략"
- "~는 공개되지 않았습니다" 같은 표현 금지
- 단순히 정보 없이 빼기

[절대 생성 금지]
- 임상, 논문, 연구 결과
- GMP, HACCP 등 인증
- 특허 정보
- 효능 (혈당 개선, 체중 감소 등)
- 확인되지 않은 수치

[문체]
객관적이고, 신뢰감 있고, 명확함`,
    description: "제품의 객관적 우수성을 입증하는 카피.",
  },
  {
    id: "concise",
    label: "✂️ 핵심 압축형",
    instruction: `당신은 모바일 UX 카피라이터입니다.
목표는 최소한의 글자로 최대한의 정보를 전달하는 것입니다.

[가장 중요한 규칙]
현재 글자수 기준 50% 이하로 압축
무조건입니다.

[압축 방식]
1. 불필요한 수식어 제거
2. 긴 문장을 짧게 쪼개기
3. 반복 표현 제거
4. 부사, 형용사 최소화
5. "제목 + 핵심만" 구조

[절대 금지]
- 새로운 정보 추가
- 새로운 장점 생성
- 내용 순서 변경
- 의미 왜곡

[예시 변환]
Before: "이 제품은 특별하게 선별된 원료로 만들어져 있으며 엄격한 품질 관리를 통해 안전성을 보장합니다."
After: "엄선된 원료, 엄격한 품질 관리."

[문체]
짧고, 빠르고, 명확함`,
    description: "50% 이하로 압축한 핵심 카피.",
  },
  {
    id: "target",
    label: "👥 타깃 맞춤형",
    instruction: `당신은 타깃 전문 마케터입니다.
목표는 특정 고객에게 깊은 공감과 연결을 만드는 것입니다.

[가장 중요한 규칙]
첫 문장에 타깃 고객을 직접 언급
무조건입니다.

[타깃별 언급 예시]
- 40대 여성이라면: "40대에 접어드니 ___"
- 운동하는 사람이라면: "운동을 시작했다면 ___"
- 바쁜 직장인이라면: "바쁜 아침 ___"
- 부모라면: "아이를 키우면서 ___"
- 갱년기라면: "갱년기를 준비한다면 ___"

[개선 방식]
1. 타깃의 일상, 상황, 고민 중심으로
2. 타깃이 사용하는 언어와 톤 적용
3. 타깃이 경험한 감정 반영
4. 타깃의 해결책으로 제품 제시

[타깃 정보가 없으면]
기존 내용을 유지
임의로 고민이나 상황 생성 금지

[절대 금지]
- 없는 고민 만들기
- 가짜 통계나 후기
- 확인되지 않은 효능

[문체]
공감적이고, 친근하고, 구체적`,
    description: "타깃 고객에게 깊은 공감을 주는 카피.",
  },
];


export default function SectionEditor({ section, onSave, onClose, onAIImproveRequest, aiResult }) {
  const [data, setData] = useState(section || {});
  const [selectedOptionId, setSelectedOptionId] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const selectedOption = useMemo(
    () => IMPROVEMENT_OPTIONS.find((option) => option.id === selectedOptionId) || null,
    [selectedOptionId]
  );

  const update = (key, value) => setData({ ...data, [key]: value });

  const instruction = selectedOption?.instruction || "";

  const canRequestImprove = Boolean(onAIImproveRequest && instruction && !aiLoading);

  // AI 개선 결과가 도착하면 편집 중인 데이터에도 동일하게 반영합니다.
  // 이렇게 해야 AI 결과 확인 후 일반 "저장"을 눌러도 개선 내용이 저장됩니다.
  useEffect(() => {
    if (!aiResult) return;

    setData((current) => ({
      ...current,
      title: aiResult.title ?? current.title ?? "",
      body: aiResult.body ?? current.body ?? "",
    }));
  }, [aiResult]);

  const applyAIResult = () => {
    if (!aiResult) return;

    const nextData = {
      ...data,
      title: aiResult.title ?? data.title ?? "",
      body: aiResult.body ?? data.body ?? "",
    };

    setData(nextData);
    onSave(nextData);
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Section Editor</h3>
      <label>제목</label>
      <input
        value={data.title || ""}
        onChange={(event) => update("title", event.target.value)}
        style={{ width: "100%" }}
      />

      <label>본문</label>
      <textarea
        value={data.body || ""}
        onChange={(event) => update("body", event.target.value)}
        style={{ width: "100%", minHeight: 100 }}
      />

      <label>핵심 포인트</label>
      <textarea
        value={(data.items || []).join("\n")}
        onChange={(event) => update("items", event.target.value.split("\n").filter(Boolean))}
        style={{ width: "100%" }}
      />

      <div style={{ marginTop: 20 }}>
        <h4 style={{ marginBottom: 10 }}>✨ AI 개선 요청</h4>
        <label
          htmlFor="ai-improvement-option"
          style={{ display: "block", marginBottom: 7, fontSize: 13, fontWeight: 700 }}
        >
          어떤 방향으로 개선할까요?
        </label>
        <select
          id="ai-improvement-option"
          value={selectedOptionId}
          onChange={(event) => {
            setSelectedOptionId(event.target.value);
          }}
          style={{
            width: "100%",
            minHeight: 42,
            padding: "9px 10px",
            border: "1px solid #d8d1c7",
            borderRadius: 8,
            background: "#fff",
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          <option value="">개선 방향을 선택하세요</option>
          {IMPROVEMENT_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>

        {selectedOption && (
          <div
            style={{
              marginTop: 10,
              padding: "11px 12px",
              borderRadius: 9,
              background: "#faf7f0",
              border: "1px solid #ece3d8",
              fontSize: 13,
              lineHeight: 1.55,
              color: "#5f5248",
            }}
          >
            <strong style={{ display: "block", marginBottom: 3, color: "#3c332d" }}>
              선택: {selectedOption.label}
            </strong>
            {selectedOption.description}
          </div>
        )}

        <button
          type="button"
          disabled={!canRequestImprove}
          onClick={async () => {
            if (!canRequestImprove) return;
            setAiLoading(true);
            try {

              await onAIImproveRequest({
                section,
                data,
                instruction,
                option: selectedOption.id,
                optionLabel: selectedOption.label,
              });
            } finally {
              setAiLoading(false);
            }
          }}
          style={{
            marginTop: 10,
            padding: "9px 14px",
            border: "none",
            borderRadius: 8,
            background: canRequestImprove ? "#8A6A56" : "#d8d2cc",
            color: "#fff",
            fontWeight: 700,
            cursor: canRequestImprove ? "pointer" : "not-allowed",
          }}
        >
          {aiLoading ? "AI 개선 중..." : "AI 개선 요청"}
        </button>
      </div>

      {aiResult && (
        <div style={{ marginTop: 20, padding: 12, border: "1px solid #ddd", borderRadius: 10, background: "#faf7f0" }}>
          <h4>✨ AI 개선 결과</h4>
          <p><b>제목</b></p>
          <p>{aiResult.title}</p>
          <p><b>본문</b></p>
          <p>{aiResult.body}</p>
          <button type="button" onClick={applyAIResult}>
            적용
          </button>
        </div>
      )}

      <button type="button" onClick={() => onSave(data)}>저장</button>
      <button type="button" onClick={onClose}>취소</button>
    </div>
  );
}
