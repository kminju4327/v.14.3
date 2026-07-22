import { ImagePlus, RefreshCw, Upload, LoaderCircle } from "lucide-react";

const buttonStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  border: "1px solid rgba(255,255,255,.34)",
  borderRadius: 8,
  padding: "7px 10px",
  background: "rgba(24,24,22,.58)",
  color: "#fff",
  fontSize: 11.5,
  fontWeight: 750,
  cursor: "pointer",
  backdropFilter: "blur(10px)",
};

export default function ImageToolbar({ hasImage, loading, onGenerate, onUpload }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      <button type="button" onClick={onGenerate} disabled={loading} style={{ ...buttonStyle, opacity: loading ? .7 : 1 }}>
        {loading ? <LoaderCircle size={14} className="spin" /> : hasImage ? <RefreshCw size={14} /> : <ImagePlus size={14} />}
        {loading ? "생성 중" : hasImage ? "이미지 재생성" : "이미지 생성"}
      </button>
      <label style={buttonStyle}>
        <Upload size={14} /> 이미지 업로드
        <input type="file" accept="image/*" onChange={onUpload} style={{ display: "none" }} />
      </label>
    </div>
  );
}
