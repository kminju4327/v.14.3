// Image generation adapter.
// Phase 2 uses a deterministic local SVG mock. Replace generateSectionImage()
// with a real provider later without changing the UI components.

const palettes = [
  ["#F5EFE5", "#C8A97E", "#4F5D4A"],
  ["#EEF2EC", "#A8B49B", "#3E5142"],
  ["#F4F1EC", "#D7C8B6", "#705A47"],
  ["#F1ECE7", "#B98D72", "#4D3930"],
  ["#EEF0F3", "#A7B0BD", "#3D4652"],
];

const escapeXml = (value = "") => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/\"/g, "&quot;")
  .replace(/'/g, "&apos;");

function hash(input = "") {
  return Array.from(String(input)).reduce((acc, ch) => ((acc << 5) - acc + ch.charCodeAt(0)) | 0, 0);
}

function toDataUrl(svg) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export async function generateSectionImage({ section, prompt = "", width = 1200, height = 760 } = {}) {
  await new Promise((resolve) => setTimeout(resolve, 850));
  const title = section?.content?.title || section?.title || "AI DETAIL VISUAL";
  const seed = Math.abs(hash(`${section?.id || "section"}-${prompt}-${Date.now()}`));
  const [bg, mid, accent] = palettes[seed % palettes.length];
  const shortPrompt = (prompt || section?.visual?.prompt || `${title} 제품 상세페이지 비주얼`).slice(0, 80);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${bg}"/>
          <stop offset="62%" stop-color="${mid}"/>
          <stop offset="100%" stop-color="${accent}"/>
        </linearGradient>
        <filter id="blur"><feGaussianBlur stdDeviation="42"/></filter>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <circle cx="${170 + (seed % 160)}" cy="${150 + (seed % 110)}" r="170" fill="#FFFFFF" opacity=".22" filter="url(#blur)"/>
      <circle cx="${920 - (seed % 130)}" cy="${500 - (seed % 90)}" r="240" fill="#FFFFFF" opacity=".13" filter="url(#blur)"/>
      <path d="M0 ${height * .72} C ${width * .25} ${height * .52}, ${width * .52} ${height * .96}, ${width} ${height * .62} L ${width} ${height} L0 ${height}Z" fill="#FFFFFF" opacity=".15"/>
      <g opacity=".86">
        <rect x="${width * .68}" y="${height * .16}" width="${width * .19}" height="${height * .55}" rx="42" fill="#FFFFFF" opacity=".26"/>
        <rect x="${width * .715}" y="${height * .22}" width="${width * .10}" height="${height * .43}" rx="28" fill="#FFFFFF" opacity=".36"/>
      </g>
      <text x="56" y="${height - 66}" font-family="Arial, sans-serif" font-size="19" letter-spacing="3" fill="#FFFFFF" opacity=".76">MOCK IMAGE · ${escapeXml(shortPrompt.toUpperCase())}</text>
    </svg>`;

  return {
    imageUrl: toDataUrl(svg),
    provider: "mock",
    prompt: shortPrompt,
    status: "completed",
    generatedAt: new Date().toISOString(),
  };
}
