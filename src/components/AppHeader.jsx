import React from 'react';

export default function AppHeader({ 
  currentProjectName = "새 프로젝트",
  onSave,
  isSaving = false,
  saveStatus = "ready",
  actions = null,
  onLogoClick = null
}) {
  const getStatusText = () => {
    if (saveStatus === null) return null;
    if (isSaving) return "저장 중...";
    if (saveStatus === "saved") return "저장됨";
    if (saveStatus === "unsaved") return "저장되지 않은 변경사항";
    return "";
  };

  const getStatusColor = () => {
    if (isSaving) return "var(--text-muted)";
    if (saveStatus === "saved") return "var(--success)";
    if (saveStatus === "unsaved") return "var(--warning)";
    return "var(--text-muted)";
  };

  return (
    <header className="app-header" style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      height: "64px",
      backgroundColor: "var(--bg-surface)",
      borderBottom: "1px solid var(--border-soft)",
      boxShadow: "var(--shadow-sm)",
      zIndex: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      paddingLeft: "var(--spacing-lg)",
      paddingRight: "var(--spacing-lg)",
    }}>
      {/* 좌측: 로고 및 프로젝트명 */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-md)" }}>
        <button
          type="button"
          onClick={onLogoClick || undefined}
          aria-label="BRAND ENGINE 홈으로 이동"
          title="처음 화면으로 이동"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--spacing-sm)",
            padding: 0,
            border: "none",
            background: "transparent",
            cursor: onLogoClick ? "pointer" : "default",
            font: "inherit"
          }}
        >
          <span style={{
            fontSize: "16px",
            fontWeight: "700",
            color: "var(--brand-primary)",
            letterSpacing: "-0.5px"
          }}>
            BRAND ENGINE
          </span>
          <span style={{
            fontSize: "11px",
            color: "var(--text-muted)",
            fontWeight: "500",
            textTransform: "uppercase"
          }}>
            v12.1
          </span>
        </button>
        
        {currentProjectName && (<>
          <div style={{
            height: "20px",
            width: "1px",
            backgroundColor: "var(--border-soft)"
          }} />
          <div style={{
            fontSize: "var(--font-size-md)",
            color: "var(--text-secondary)",
            fontWeight: "500",
            maxWidth: "300px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}>
            {currentProjectName}
          </div>
        </>)}
      </div>

      {/* 우측: 상태 및 버튼 */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-lg)" }}>
        {/* 저장 상태 표시 */}
        {getStatusText() && (
          <div style={{
            fontSize: "var(--font-size-sm)",
            color: getStatusColor(),
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            gap: "var(--spacing-xs)"
          }}>
            {isSaving && (
              <div className="spin" style={{ display: "inline-block" }}>
                ◆
              </div>
            )}
            {getStatusText()}
          </div>
        )}

        {actions}
      </div>
    </header>
  );
}
