import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.handle}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Contour rings of a saddle, drawn as SVG paths, with the name on top. */
function contours() {
  const paths: string[] = [];
  // hyperbolic iso-lines of x² - z² = c, mapped into the frame
  const cx = 780;
  const cy = 330;
  const k = 95;
  for (let c = -6; c <= 6; c++) {
    if (c === 0) continue;
    const pts: string[] = [];
    for (let i = -60; i <= 60; i++) {
      const t = i / 20;
      const x = c > 0 ? Math.cosh(t) * Math.sqrt(c) : Math.sinh(t) * Math.sqrt(-c);
      const z = c > 0 ? Math.sinh(t) * Math.sqrt(c) : Math.cosh(t) * Math.sqrt(-c);
      pts.push(`${(cx + x * k).toFixed(1)},${(cy + z * k * 0.55).toFixed(1)}`);
    }
    paths.push(`M${pts.join("L")}`);
    // mirrored branch
    const mirrored = pts.map((p) => {
      const [x, y] = p.split(",").map(Number);
      return `${(2 * cx - x).toFixed(1)},${(2 * cy - y).toFixed(1)}`;
    });
    paths.push(`M${mirrored.join("L")}`);
  }
  return paths;
}

export default function OG() {
  const paths = contours();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0b0d12",
          color: "#ecece8",
          position: "relative",
          fontFamily: "Georgia, serif",
        }}
      >
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", inset: 0 }}>
          <defs>
            <radialGradient id="g" cx="65%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#98c1d9" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0b0d12" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="1200" height="630" fill="url(#g)" />
          {paths.map((d, i) => (
            <path key={i} d={d} fill="none" stroke={i % 4 < 2 ? "#98c1d9" : "#ee6c4d"} strokeOpacity="0.55" strokeWidth="1.5" />
          ))}
          <circle cx="780" cy="330" r="6" fill="#ee6c4d" />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 72, width: "100%" }}>
          <div style={{ fontFamily: "monospace", fontSize: 22, letterSpacing: 4, color: "#9a9da6", textTransform: "uppercase" }}>
            {`${site.role} · ${site.company}`}
          </div>
          <div style={{ display: "flex", fontSize: 128, lineHeight: 1, letterSpacing: -3, marginTop: 18 }}>
            <span>Astitva&nbsp;</span>
            <span style={{ color: "#ee6c4d", fontStyle: "italic" }}>Jaiswal</span>
          </div>
          <div style={{ fontFamily: "monospace", fontSize: 24, color: "#9a9da6", marginTop: 26, letterSpacing: 2 }}>ar5entum.vercel.app</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
