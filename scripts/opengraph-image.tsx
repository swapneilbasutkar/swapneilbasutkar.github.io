import { ImageResponse } from "next/og";
import { portfolio } from "@/content/portfolio";

export const alt = `${portfolio.profile.name} — ${portfolio.profile.descriptor}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Required for `output: "export"`: the card has no request-time inputs, so it
// is rendered once at build time and written out as a PNG.
export const dynamic = "force-static";

/**
 * Social preview card, generated at build time. It uses the bundled default
 * font only, so nothing is fetched while building.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0b0d0e",
          color: "#e9e5dd",
          padding: 64,
          fontFamily: "monospace",
        }}
      >
        {/* Decorative window controls */}
        <div style={{ display: "flex", gap: 12, marginBottom: 48 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: "#3e4446" }}
            />
          ))}
        </div>

        <div style={{ display: "flex", fontSize: 26, color: "#7fc08a", marginBottom: 28 }}>
          {portfolio.profile.handle}
          <span style={{ color: "#6d7577" }}>:~$ whoami</span>
        </div>

        <div style={{ display: "flex", fontSize: 76, fontWeight: 700, letterSpacing: -2 }}>
          {portfolio.profile.name}
        </div>

        <div style={{ display: "flex", fontSize: 30, color: "#e0b341", marginTop: 18 }}>
          {portfolio.profile.descriptor}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 36,
            color: "#98a0a2",
            marginTop: 40,
            lineHeight: 1.35,
          }}
        >
          {portfolio.profile.headline}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "auto",
            fontSize: 24,
            color: "#6d7577",
            borderTop: "2px solid #242a2d",
            paddingTop: 24,
          }}
        >
          {portfolio.profile.location}
          <span style={{ margin: "0 16px" }}>·</span>
          {portfolio.links.githubLabel}
        </div>
      </div>
    ),
    size,
  );
}
