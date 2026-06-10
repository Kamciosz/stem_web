import { ImageResponse } from "next/og";

export const alt = "Twój progres - STEM INF.03";
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
                    /progres
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
                            fontSize: 90,
                            fontWeight: 800,
                            lineHeight: 1.05,
                            letterSpacing: "-0.03em",
                        }}
                    >
                        Twój progres
                    </div>
                    <div
                        style={{
                            fontSize: 30,
                            color: "#ccc3d8",
                            lineHeight: 1.3,
                            maxWidth: 900,
                        }}
                    >
                        Śledź swoje ukończone arkusze, zdobywaj odznaki, eksportuj dane. Wszystko lokalnie, bez kont.
                    </div>
                </div>
                <div
                    style={{
                        display: "flex",
                        gap: 16,
                        marginTop: 30,
                    }}
                >
                    {["🌱", "🎯", "🔥", "👑", "🧬"].map((e, i) => (
                        <div
                            key={i}
                            style={{
                                width: 80,
                                height: 80,
                                background: "rgba(74, 222, 128, 0.1)",
                                border: "1px solid rgba(74, 222, 128, 0.4)",
                                borderRadius: 12,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 44,
                            }}
                        >
                            {e}
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
                    <span>54 arkusze · 5 odznak</span>
                </div>
            </div>
        ),
        { ...size }
    );
}
