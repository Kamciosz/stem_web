import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "STEM | Koło Technologiczne — robotyka, mechatronika, programowanie";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    backgroundColor: "#0a0a0a",
                    padding: "80px",
                    fontFamily: "sans-serif"
                }}
            >
                <div
                    style={{
                        fontSize: 40,
                        color: "#888888",
                        letterSpacing: "0.3em",
                        marginBottom: 24
                    }}
                >
                    KOŁO TECHNOLOGICZNE
                </div>
                <div
                    style={{
                        fontSize: 220,
                        fontWeight: 700,
                        color: "#ffffff",
                        lineHeight: 1,
                        letterSpacing: "-0.02em"
                    }}
                >
                    STEM
                </div>
                <div
                    style={{
                        fontSize: 36,
                        color: "#cccccc",
                        marginTop: 32
                    }}
                >
                    Robotyka · Mechatronika · Programowanie
                </div>
            </div>
        ),
        { ...size }
    );
}
