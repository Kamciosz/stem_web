import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "INF.03-02 — Styczeń 2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: "linear-gradient(135deg, #000 0%, #15121b 100%)",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "sans-serif",
                    color: "#e8dfee",
                }}
            >
                <div style={{ fontSize: 72, fontWeight: 800, marginBottom: 16 }}>
                    INF.03-02
                </div>
                <div style={{ fontSize: 36, color: "#7c3aed" }}>
                    Styczeń 2026
                </div>
            </div>
        ),
        { ...size }
    );
}
