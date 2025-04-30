// static/js/glitchify.js
export function glitchify(text, options = {}) {
  const {
    className = "glitch-text",
    intensity = "medium",   // "low" | "medium" | "high"
    pulse = true,
  } = options;

  const intensityClass = {
    low: "animate-glitch-slow",
    medium: "animate-glitch",
    high: "animate-glitch-fast",
  }[intensity] || "animate-glitch";

  return `
    <span class="${className} ${pulse ? 'pulse-glow' : ''} ${intensityClass}" data-text="${text}">
      ${text}
    </span>
  `;
}
