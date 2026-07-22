import React from 'react';

export default function PageContainer({
  children,
  maxWidth = "lg",
  noPadding = false,
  style = {},
  ...props
}) {
  const maxWidthValue = {
    sm: "var(--max-width-sm)",
    md: "var(--max-width-md)",
    lg: "var(--max-width-lg)",
    xl: "var(--max-width-xl)",
    full: "100%"
  }[maxWidth] || "var(--max-width-lg)";

  return (
    <div
      style={{
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth: maxWidthValue,
        width: "100%",
        padding: noPadding ? 0 : "var(--spacing-lg)",
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
}
