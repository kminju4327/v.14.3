import React from 'react';

const VARIANTS = {
  primary: {
    bg: "var(--brand-primary)",
    bgHover: "var(--brand-primary-hover)",
    text: "var(--text-inverse)",
    border: "transparent"
  },
  secondary: {
    bg: "var(--bg-subtle)",
    bgHover: "var(--border-soft)",
    text: "var(--text-primary)",
    border: "var(--border-default)"
  },
  tertiary: {
    bg: "transparent",
    bgHover: "var(--bg-subtle)",
    text: "var(--text-primary)",
    border: "transparent"
  },
  danger: {
    bg: "var(--danger)",
    bgHover: "var(--danger)",
    text: "var(--text-inverse)",
    border: "transparent",
    opacity: 0.9
  },
  success: {
    bg: "var(--success)",
    bgHover: "var(--success)",
    text: "var(--text-inverse)",
    border: "transparent",
    opacity: 0.9
  }
};

const SIZES = {
  sm: {
    padding: "6px 12px",
    fontSize: "var(--font-size-sm)",
    height: "32px"
  },
  md: {
    padding: "10px 20px",
    fontSize: "var(--font-size-base)",
    height: "40px"
  },
  lg: {
    padding: "12px 24px",
    fontSize: "var(--font-size-md)",
    height: "48px"
  }
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  style = {},
  className = "",
  ...props
}) {
  const variantStyle = VARIANTS[variant] || VARIANTS.primary;
  const sizeStyle = SIZES[size] || SIZES.md;

  const buttonStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "var(--spacing-xs)",
    padding: sizeStyle.padding,
    height: sizeStyle.height,
    fontSize: sizeStyle.fontSize,
    fontWeight: "500",
    fontFamily: "var(--font-family)",
    backgroundColor: variantStyle.bg,
    color: variantStyle.text,
    border: `1px solid ${variantStyle.border}`,
    borderRadius: "var(--radius-md)",
    cursor: disabled || loading ? "not-allowed" : "pointer",
    opacity: disabled || loading ? 0.6 : (variantStyle.opacity || 1),
    transition: "all var(--transition-fast)",
    whiteSpace: "nowrap",
    ...style
  };

  const handleMouseEnter = (e) => {
    if (!disabled && !loading) {
      e.currentTarget.style.backgroundColor = variantStyle.bgHover;
    }
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.backgroundColor = variantStyle.bg;
  };

  return (
    <button
      style={buttonStyle}
      disabled={disabled || loading}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
      {...props}
    >
      {loading && (
        <div className="spin" style={{ display: "inline-block", fontSize: "14px" }}>
          ◆
        </div>
      )}
      {children}
    </button>
  );
}
