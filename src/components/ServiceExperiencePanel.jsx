import React, { useEffect, useMemo, useState } from "react";
import { loadProjects, PROJECT_SAVED_EVENT } from "../engines/v11/projectStorageEngine.js";

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


function readProjects() {
  return loadProjects();
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function sectionKey(index) {
  return index === "hero" ? "hero" : `section-${index}`;
}

function sectionDisplayName(section, index) {
  if (index === "hero") return "Hero";
  return section?.title || section?.type || `섹션 ${Number(index) + 1}`;
}

export default function ServiceExperiencePanel({
  showPreview = false,
  draft = null,
  onDraftChange,
  onRegenerate,
  onLoadProject,
  onEditSection,
  onAIImproveRequest,
  regeneratingIndex = null,
}) {
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState(() => readProjects());
  const [tab, setTab] = useState("projects");
  const [editing, setEditing] = useState(null);
  const [aiPreview, setAiPreview] = useState(null);
  const [selectedImproveOption, setSelectedImproveOption] = useState("");
  const [histories, setHistories] = useState({});
  const [notice, setNotice] = useState("");

  // ✅ 수정: localStorage 변화 감시 (프로젝트 저장 시 자동 반영)
  useEffect(() => {
    const handleStorageChange = () => {
      setProjects(readProjects());
    };

    // 1초마다 localStorage 확인 (저장 감지용)
    const interval = setInterval(handleStorageChange, 1000);
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(PROJECT_SAVED_EVENT, handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(PROJECT_SAVED_EVENT, handleStorageChange);
    };
  }, []);


  const previewRows = useMemo(() => {
    if (!draft) return [];
    return [
      {
        key: "hero",
        index: "hero",
        label: "Hero",
        title: draft.hero_headline || "Hero 제목",
        body: draft.hero_subcopy || "",
      },
      ...(draft.sections || []).map((section, index) => ({
        key: sectionKey(index),
        index,
        label: sectionDisplayName(section, index),
        title: section.title || "",
        body: section.body || "",
        items: Array.isArray(section.items) ? section.items : [],
        type: section.type,
      })),
    ];
  }, [draft]);

  function refreshProjects() {
    setProjects(readProjects());
  }

  function remember(index) {
    if (!draft) return;
    const key = sectionKey(index);
    const snapshot =
      index === "hero"
        ? { hero_headline: draft.hero_headline || "", hero_subcopy: draft.hero_subcopy || "" }
        : clone(draft.sections?.[index] || {});
    setHistories((current) => ({
      ...current,
      [key]: [snapshot, ...(current[key] || [])].slice(0, 8),
    }));
  }

  function openEditor(row) {
    setEditing({
      ...row,
      title: row.title || "",
      body: row.body || "",
      itemsText: (row.items || []).join("\n"),
    });
    setFeedback("");
  }

  function saveEdit() {
    if (!editing || !draft || typeof onDraftChange !== "function") return;
    remember(editing.index);

    if (editing.index === "hero") {
      const updatedDraft = {
        ...draft,
        hero_headline: editing.title.trim(),
        hero_subcopy: editing.body.trim(),
      };
      onDraftChange(updatedDraft);
      if (typeof onEditSection === "function") {
        onEditSection("hero", {
          title: editing.title.trim(),
          body: editing.body.trim(),
          items: [],
        });
      }
    } else {
      const sections = [...(draft.sections || [])];
      const current = sections[editing.index] || {};
      const next = {
        ...current,
        title: editing.title.trim(),
        body: editing.body.trim(),
      };
      if (Array.isArray(current.items)) {
        next.items = editing.itemsText
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean);
      }
      sections[editing.index] = next;
      const updatedDraft = { ...draft, sections };
      onDraftChange(updatedDraft);
      if (typeof onEditSection === "function") {
        onEditSection(editing.index, {
          title: next.title,
          body: next.body,
          items: next.items || [],
        });
      }
    }

    setEditing(null);
    setNotice("수정 내용이 상세페이지에 반영되었습니다.");
    setTimeout(() => setNotice(""), 2200);
  }

  async function regenerate(index, instruction = "") {
    if (typeof onRegenerate !== "function") return;
    remember(index);
    await onRegenerate(index, instruction.trim());
    setFeedback("");
    setNotice("해당 섹션을 다시 생성했습니다.");
    setTimeout(() => setNotice(""), 2200);
  }

  function restoreVersion(index, versionIndex) {
    if (!draft || typeof onDraftChange !== "function") return;
    const key = sectionKey(index);
    const version = histories[key]?.[versionIndex];
    if (!version) return;
    remember(index);

    if (index === "hero") {
      onDraftChange({ ...draft, ...clone(version) });
    } else {
      const sections = [...(draft.sections || [])];
      sections[index] = clone(version);
      onDraftChange({ ...draft, sections });
    }
    setNotice("이전 버전으로 복구했습니다.");
    setTimeout(() => setNotice(""), 2200);
  }

  // 플로팅 BRAND ENGINE Tools 버튼은 노출하지 않습니다.
  // 패널 내부 기능 코드는 유지해 기존 프로젝트/편집 로직에 영향을 주지 않습니다.
  if (!open) return null;

  const tabs = [
    ["projects", "프로젝트"],
    ["strategy", "Strategy"],
    ["review", "Review"],
  ];

  return (
    <>
      <div
        style={{
          position: "fixed",
          right: 24,
          bottom: 24,
          width: 410,
          height: "80vh",
          maxHeight: "80vh",
          zIndex: 99,
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: 18,
          boxShadow: "0 10px 30px rgba(0,0,0,.15)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "18px 20px 14px",
            flexShrink: 0,
            background: "#fff",
            borderBottom: "1px solid #f0ece7",
          }}
        >
          <div>
            <b style={{ fontSize: 18 }}>Service Experience</b>
            <div style={{ fontSize: 11, color: "#8B8175", marginTop: 3 }}>
              전략 확인 · 상세페이지 수정 · 검수
            </div>
          </div>
          <button
            aria-label="닫기"
            onClick={() => setOpen(false)}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: "1px solid #ddd",
              background: "#fff",
              fontSize: 20,
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: 7,
            padding: "12px 20px",
            flexShrink: 0,
            background: "#fff",
            borderBottom: "1px solid #f0ece7",
          }}
        >
          {tabs.map(([value, label]) => (
            <button
              key={value}
              onClick={() => setTab(value)}
              style={{
                flex: 1,
                padding: "8px 6px",
                borderRadius: 8,
                border: "1px solid #ddd",
                background: tab === value ? "#8A6A56" : "#fff",
                color: tab === value ? "white" : "#333",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {notice && (
          <div style={{ padding: "9px 20px", background: "#F4EFE9", color: "#6E533F", fontSize: 12 }}>
            {notice}
          </div>
        )}

        <div style={{ overflowY: "auto", padding: "16px 20px 24px", flex: 1, minHeight: 0 }}>
          {tab === "projects" && (
            <>
              <button onClick={refreshProjects} style={{ width: "100%", padding: 10, borderRadius: 8, cursor: "pointer" }}>
                저장 프로젝트 새로고침
              </button>
              <div style={{ margin: "12px 0", fontSize: 13 }}>저장 프로젝트 {projects.length}개</div>
              {projects.length === 0 ? (
                <div style={{ padding: 20, textAlign: "center", color: "#777" }}>저장된 프로젝트가 없습니다.</div>
              ) : (
                projects.map((project) => (
                  <button
                    key={project.projectId}
                    onClick={() => typeof onLoadProject === "function" && onLoadProject(project.projectId)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: 12,
                      border: "1px solid #eee",
                      borderRadius: 10,
                      marginBottom: 8,
                      background: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    <b>{project.projectName}</b>
                    <div style={{ fontSize: 12, color: "#777", marginTop: 5 }}>
                      저장일: {new Date(project.updatedAt || project.createdAt).toLocaleDateString()}
                    </div>
                    <div style={{ marginTop: 7, color: "#8A6A56", fontSize: 11, fontWeight: 700 }}>클릭하여 불러오기 →</div>
                  </button>
                ))
              )}
            </>
          )}

          {tab === "strategy" && (
            <div style={{ lineHeight: 1.7, fontSize: 14 }}>
              <b>AI Commerce Strategy Report</b>
              {[
                ["01 제품 분석", "카테고리와 제품 특성을 기반으로 구매자가 확인해야 하는 기준을 분석합니다."],
                ["02 구매 기준", "원료·구성·품질·사용 정보를 중심으로 선택 기준을 정리합니다."],
                ["03 Story Flow", "관심 → 신뢰 → 차별점 → 선택 이유 → 행동의 흐름으로 설계합니다."],
                ["04 디자인 전략", "제품 성격에 맞는 정보 전달 방식과 이미지 방향을 연결합니다."],
              ].map(([title, body]) => (
                <div key={title} style={{ marginTop: 10, padding: 12, border: "1px solid #eee", borderRadius: 10 }}>
                  <b>{title}</b>
                  <p style={{ marginBottom: 0 }}>{body}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "review" && (
            <div style={{ lineHeight: 1.8, fontSize: 14 }}>
              <b>Human Review</b>
              <p>AI 생성 결과를 사람이 검토하는 단계입니다.</p>
              <ul>
                <li>표현 적합성</li>
                <li>카테고리 일치</li>
                <li>과장 표현 확인</li>
                <li>구매 정보 누락 체크</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {editing && (
        <div
          onMouseDown={(event) => event.target === event.currentTarget && setEditing(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 120,
            background: "rgba(32,25,20,.38)",
            display: "grid",
            placeItems: "center",
            padding: 20,
          }}
        >
          <div style={{ width: "min(620px, 94vw)", maxHeight: "86vh", overflowY: "auto", background: "#fff", borderRadius: 16, padding: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, color: "#8A6A56", fontWeight: 800 }}>{editing.label}</div>
                <b style={{ fontSize: 19 }}>섹션 직접 수정</b>
              </div>
              <button onClick={() => setEditing(null)} style={{ fontSize: 20, cursor: "pointer" }}>×</button>
            </div>

            <label style={{ display: "block", marginTop: 18, fontSize: 12, fontWeight: 800 }}>제목</label>
            <input
              value={editing.title}
              onChange={(event) => setEditing((current) => ({ ...current, title: event.target.value }))}
              style={{ width: "100%", boxSizing: "border-box", padding: 11, marginTop: 6 }}
            />

            <label style={{ display: "block", marginTop: 14, fontSize: 12, fontWeight: 800 }}>본문</label>
            <textarea
              value={editing.body}
              onChange={(event) => setEditing((current) => ({ ...current, body: event.target.value }))}
              style={{ width: "100%", boxSizing: "border-box", padding: 11, marginTop: 6, minHeight: 150, resize: "vertical" }}
            />

            {editing.items !== undefined && editing.index !== "hero" && (
              <>
                <label style={{ display: "block", marginTop: 14, fontSize: 12, fontWeight: 800 }}>목록 항목 (한 줄에 하나)</label>
                <textarea
                  value={editing.itemsText}
                  onChange={(event) => setEditing((current) => ({ ...current, itemsText: event.target.value }))}
                  style={{ width: "100%", boxSizing: "border-box", padding: 11, marginTop: 6, minHeight: 100, resize: "vertical" }}
                />
              </>
            )}

            <div style={{ marginTop: 18, padding: 12, background: "#faf7f2", borderRadius: 10 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 800, marginBottom: 8 }}>✨ AI 개선 요청</label>
              <select
                value={selectedImproveOption}
                onChange={(event) => {
                  setSelectedImproveOption(event.target.value);
                  if (event.target.value !== "custom") setCustomImproveInstruction("");
                }}
                style={{
                  width: "100%",
                  minHeight: 42,
                  padding: "9px 10px",
                  boxSizing: "border-box",
                  border: "1px solid #d8d1c7",
                  borderRadius: 8,
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                <option value="">개선 방향을 선택하세요</option>
                {IMPROVEMENT_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>

              {selectedImproveOption && (() => {
                const selected = IMPROVEMENT_OPTIONS.find((option) => option.id === selectedImproveOption);
                return selected ? (
                  <div style={{ marginTop: 9, padding: "10px 11px", border: "1px solid #ece3d8", borderRadius: 8, background: "#fffaf3", fontSize: 12, lineHeight: 1.55, color: "#5f5248" }}>
                    <b style={{ display: "block", marginBottom: 2, color: "#3c332d" }}>선택: {selected.label}</b>
                    {selected.description}
                  </div>
                ) : null;
              })()}

              <button
                type="button"
                disabled={
                  !onAIImproveRequest ||
                  !selectedImproveOption
                }
                onClick={() => {
                  if (!onAIImproveRequest) return;
                  const selected = IMPROVEMENT_OPTIONS.find((option) => option.id === selectedImproveOption);
                  const instruction = selected?.instruction || "";
                  if (!instruction) return;
                  onAIImproveRequest({
                    section: editing,
                    data: editing,
                    instruction,
                  });
                }}
                style={{
                  marginTop: 9,
                  padding: "8px 12px",
                  background: selectedImproveOption ? "#8A6A56" : "#d8d2cc",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  cursor: selectedImproveOption ? "pointer" : "not-allowed",
                }}
              >
                ✨ AI 개선 적용
              </button>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 18 }}>
              <button onClick={() => setEditing(null)} style={{ padding: "9px 14px", cursor: "pointer" }}>취소</button>
              <button onClick={saveEdit} style={{ padding: "9px 14px", background: "#8A6A56", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>
                수정 저장
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
