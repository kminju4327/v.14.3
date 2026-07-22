import { useMemo, useState } from "react";
import ImageToolbar from "./ImageToolbar.jsx";
import { generateSectionImage } from "../services/imageService.js";
import { normalizeSectionItems } from "../utils/sectionItem.js";

const positionMap = {
  top: "flex-start",
  center: "center",
  bottom: "flex-end",
};

export default function ImageFirstSection({ section, index, accent, conceptStyle, onChange, sectionLabel, EmphasizedText, isEditing = false, editValue = null, onEditValueChange }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const visual = section?.visual || {};
  const design = section?.design || {};
  const content = section?.content || {};
  const sourceSection = isEditing && editValue ? editValue : section;
  const sourceContent = sourceSection?.content || {};
  const title = sourceContent.title || sourceSection?.title || "";
  const body = sourceContent.body || sourceSection?.body || "";
  const items = normalizeSectionItems(sourceContent.items || sourceSection?.items || []);
  const imageUrl = visual.imageUrl || "";
  const isDarkText = !imageUrl;

  const prompt = useMemo(() => visual.prompt || `${title || sectionLabel(section?.type)}를 표현하는 고급 이커머스 상세페이지 배경, 텍스트 없이`, [visual.prompt, title, section?.type, sectionLabel]);

  const updateVisual = (patch) => onChange?.({
    ...section,
    visual: { ...visual, ...patch },
  });

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    updateVisual({ status: "generating", prompt });
    try {
      const result = await generateSectionImage({ section, prompt });
      updateVisual(result);
    } catch (e) {
      setError("이미지 생성에 실패했습니다.");
      updateVisual({ status: "failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateVisual({ imageUrl: String(reader.result || ""), provider: "upload", status: "completed", alt: file.name });
    reader.onerror = () => setError("이미지를 불러오지 못했습니다.");
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const textColor = imageUrl ? (design.textColor || "#FFFFFF") : "#253027";
  const overlayOpacity = Number.isFinite(Number(design.overlayOpacity)) ? Number(design.overlayOpacity) : .34;
  const minHeight = Math.max(420, Math.min(Number(design.sectionHeight) || 620, 760));

  return (
    <div style={{ position: "relative", overflow: "hidden", minHeight, borderRadius: conceptStyle.radius, boxShadow: "0 16px 38px rgba(31,42,36,.10)", border: "1px solid rgba(31,42,36,.09)", background: imageUrl ? "#2f382f" : "linear-gradient(135deg,#F7F4EE,#E8E2D8)" }}>
      {imageUrl ? (
        <img src={imageUrl} alt={visual.alt || title || "section visual"} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", padding: 30, textAlign: "center" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 850, letterSpacing: ".08em", color: accent, marginBottom: 8 }}>IMAGE PLACEHOLDER</div>
            <div style={{ fontSize: 13, color: "#7B746A", lineHeight: 1.65, maxWidth: 430 }}>섹션 이미지를 생성하면 정확한 텍스트가 이미지 위에 별도 레이어로 표시됩니다.</div>
          </div>
        </div>
      )}
      {imageUrl && <div style={{ position: "absolute", inset: 0, background: `rgba(19,24,20,${Math.max(0, Math.min(overlayOpacity, .8))})` }} />}

      <div style={{ position: "absolute", top: 14, left: 14, right: 52, zIndex: 3 }}>
        <ImageToolbar hasImage={!!imageUrl} loading={loading || visual.status === "generating"} onGenerate={handleGenerate} onUpload={handleUpload} />
      </div>

      <div style={{ position: "relative", zIndex: 2, minHeight, padding: "86px 52px 48px", display: "flex", flexDirection: "column", justifyContent: positionMap[design.textPosition] || "center", textAlign: design.textAlign || "left", color: textColor }}>
        <div style={{ fontSize: 11, fontWeight: 850, letterSpacing: 1.8, textTransform: "uppercase", opacity: .78, marginBottom: 14 }}>
          {String(index + 1).padStart(2, "0")} · {sectionLabel(section?.type)}
        </div>
        {isEditing ? (
          <>
            <input
              value={title}
              onChange={(event) => onEditValueChange?.("title", event.target.value)}
              aria-label="섹션 제목 수정"
              style={{ width: "min(620px, 100%)", boxSizing: "border-box", fontFamily: conceptStyle.headFont, fontWeight: conceptStyle.headWeight, fontSize: 30, lineHeight: 1.3, letterSpacing: "-.03em", marginBottom: 14, padding: "8px 10px", color: textColor, background: imageUrl ? "rgba(255,255,255,.12)" : "rgba(255,255,255,.78)", border: `1px dashed ${imageUrl ? "rgba(255,255,255,.8)" : accent}`, borderRadius: 8, outline: "none" }}
            />
            <textarea
              value={body}
              onChange={(event) => onEditValueChange?.("body", event.target.value)}
              aria-label="섹션 본문 수정"
              rows={4}
              style={{ width: "min(650px, 100%)", resize: "vertical", boxSizing: "border-box", fontSize: 15, lineHeight: 1.9, padding: "9px 10px", color: textColor, background: imageUrl ? "rgba(255,255,255,.12)" : "rgba(255,255,255,.78)", border: `1px dashed ${imageUrl ? "rgba(255,255,255,.8)" : accent}`, borderRadius: 8, outline: "none" }}
            />
            {items.length > 0 && <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14, maxWidth: 650 }}>{items.map((item, itemIndex) => <div key={itemIndex} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}><span style={{ fontWeight: 900, paddingTop: 9 }}>—</span><input value={item} onChange={(event) => onEditValueChange?.("item", event.target.value, itemIndex)} aria-label={`핵심 포인트 ${itemIndex + 1} 수정`} style={{ flex: 1, minWidth: 0, padding: "8px 10px", fontSize: 14.5, lineHeight: 1.5, color: textColor, background: imageUrl ? "rgba(255,255,255,.12)" : "rgba(255,255,255,.78)", border: `1px dashed ${imageUrl ? "rgba(255,255,255,.8)" : accent}`, borderRadius: 8, outline: "none" }} /></div>)}</div>}
          </>
        ) : (
          <>
            {title && <div style={{ fontFamily: conceptStyle.headFont, fontWeight: conceptStyle.headWeight, fontSize: 30, lineHeight: 1.3, letterSpacing: "-.03em", marginBottom: 14, maxWidth: 620 }}><EmphasizedText text={title} accent={imageUrl ? "#fff" : accent} /></div>}
            {body && <div style={{ fontSize: 15, lineHeight: 1.9, opacity: imageUrl ? .94 : .82, maxWidth: 650 }}><EmphasizedText text={body} accent={imageUrl ? "#fff" : accent} /></div>}
            {items.length > 0 && <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 16, maxWidth: 650 }}>{items.map((item, itemIndex) => <div key={itemIndex} style={{ display: "flex", gap: 10, fontSize: 14.5, lineHeight: 1.7 }}><span style={{ fontWeight: 900 }}>—</span><span><EmphasizedText text={item} accent={imageUrl ? "#fff" : accent} /></span></div>)}</div>}
          </>
        )}
        {error && <div style={{ marginTop: 14, padding: "9px 11px", borderRadius: 8, background: "rgba(176,42,42,.12)", color: imageUrl ? "#fff" : "#A72B2B", fontSize: 12.5 }}>{error}</div>}
      </div>
    </div>
  );
}
