import { ImageResponse } from "next/og";

export const alt = "Wszystkie egzaminy INF.03 - STEM";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    background: "linear-gradient(135deg, #0d0a14 0%, #1a0a2e 100%)",
                    color: "#F5F3FF",
                    padding: "60px 80px",
                    fontFamily: "system-ui",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        fontSize: 28,
                        color: "#a78bfa",
                        marginBottom: 20,
                    }}
                >
                    <div
                        style={{
                            width: 8,
                            height: 8,
                            background: "#a78bfa",
                            borderRadius: 999,
                        }}
                    />
                    KURS INF.03
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                        flex: 1,
                        justifyContent: "center",
                    }}
                >
                    <div
                        style={{
                            fontSize: 84,
                            fontWeight: 800,
                            lineHeight: 1.05,
                            letterSpacing: "-0.03em",
                        }}
                    >
                        Wszystkie egzaminy
                    </div>
                    <div
                        style={{
                            fontSize: 30,
                            color: "#ccc3d8",
                            lineHeight: 1.3,
                            maxWidth: 900,
                        }}
                    >
                        54 arkusze · 6 sesji (styczen 2023 — styczen 2026). Filtry po technologii, sesji, statusie progresu.
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        gap: 12,
                        marginTop: 30,
                    }}
                >
                    {["PHP", "SQL", "JavaScript", "HTML", "CSS"].map((t) => (
                        <div
                            key={t}
                            style={{
                                padding: "10px 22px",
                                background: "rgba(124, 58, 237, 0.18)",
                                border: "1px solid rgba(124, 58, 237, 0.5)",
                                borderRadius: 999,
                                fontSize: 24,
                                color: "#c4b5fd",
                            }}
                        >
                            {t}
                        </div>
                    ))}
                </div>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: 40,
                        fontSize: 26,
                        color: "#a78bfa",
                    }}
                >
                    <span style={{ fontWeight: 600 }}>STEM · INF.03</span>
                    <span>styczen 2023 — styczen 2026</span>
                </div>
            </div>
        ),
        { ...size }
    );
}
