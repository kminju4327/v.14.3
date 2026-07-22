import React from 'react';

export default function Card({
  children,
  title,
  subtitle,
  label,
  noPadding = false,
  style = {},
  className = "",
  ...props
}) {
  return (
    <div
      style={{
        backgroundColor: "var(--bg-surface)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border-soft)",
        boxShadow: "var(--shadow-sm)",
        overflow: "hidden",
        ...style
      }}
      className={className}
      {...props}
    >
      {(label || title) && (
        <div style={{
          padding: "var(--spacing-md)",
          borderBottom: "1px solid var(--border-soft)",
          backgroundColor: "var(--bg-subtle)"
        }}>
          {label && (
            <div style={{
              fontSize: "var(--font-size-xs)",
              color: "var(--text-muted)",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "var(--spacing-xs)"
            }}>
              {label}
            </div>
          )}
          {title && (
            <div style={{
              fontSize: "var(--font-size-lg)",
              fontWeight: "600",
              color: "var(--text-primary)",
              lineHeight: "var(--line-height-tight)"
            }}>
              {title}
            </div>
          )}
          {subtitle && (
            <div style={{
              fontSize: "var(--font-size-sm)",
              color: "var(--text-secondary)",
              marginTop: "var(--spacing-xs)",
              lineHeight: "var(--line-height-normal)"
            }}>
              {subtitle}
            </div>
          )}
        </div>
      )}

      <div style={{
        padding: noPadding ? 0 : "var(--spacing-lg)"
      }}>
        {children}
      </div>
    </div>
  );
}
