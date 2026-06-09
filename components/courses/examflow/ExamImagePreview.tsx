"use client";

import { useEffect, useId, useState } from "react";

type ExamImagePreviewProps = {
    src: string;
    alt: string;
    title?: string;
    className?: string;
};

function clampZoom(value: number) {
    return Math.min(4, Math.max(0.5, Number(value.toFixed(2))));
}

export function ExamImagePreview({ src, alt, title, className }: ExamImagePreviewProps) {
    const [open, setOpen] = useState(false);
    const [zoom, setZoom] = useState(1);
    const titleId = useId();

    function close() {
        setOpen(false);
        setZoom(1);
    }

    useEffect(() => {
        if (!open) return;
        const previousOverflow = document.body.style.overflow;
        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") close();
            if (event.key === "+" || event.key === "=") setZoom((value) => clampZoom(value + 0.25));
            if (event.key === "-") setZoom((value) => clampZoom(value - 0.25));
            if (event.key === "0") setZoom(1);
        };
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", onKey);
        };
    }, [open]);

    const label = title ?? alt;
    const zoomPercent = Math.round(zoom * 100);
    const imageStyle = { "--exam-image-zoom": String(zoom) };

    return (
        <>
            <button
                type="button"
                className={`exam-image-preview${className ? ` ${className}` : ""}`}
                onClick={() => setOpen(true)}
                aria-label={`Powiększ obraz: ${label}`}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={alt} loading="lazy" />
                <span className="exam-image-preview-badge" aria-hidden="true">Powiększ</span>
            </button>

            {open && (
                <div
                    className="exam-image-lightbox"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={titleId}
                >
                    <button type="button" className="exam-image-lightbox-backdrop" onClick={close} aria-label="Zamknij podgląd" />
                    <div className="exam-image-lightbox-panel">
                        <div className="exam-image-lightbox-toolbar">
                            <div className="exam-image-lightbox-titleblock">
                                <strong id={titleId}>{label}</strong>
                                <span>Podgląd materiału egzaminacyjnego</span>
                            </div>
                            <div className="exam-image-lightbox-actions" aria-label="Sterowanie obrazem">
                                <span className="exam-image-lightbox-zoom" aria-live="polite">Zoom {zoomPercent}%</span>
                                <button type="button" onClick={() => setZoom((value) => clampZoom(value - 0.25))} aria-label="Pomniejsz obraz">−</button>
                                <button type="button" onClick={() => setZoom(1)} aria-label="Przywróć domyślny rozmiar obrazu">Reset</button>
                                <button type="button" onClick={() => setZoom((value) => clampZoom(value + 0.25))} aria-label="Powiększ obraz">+</button>
                                <a href={src} target="_blank" rel="noopener noreferrer">Nowa karta</a>
                                <button type="button" className="exam-image-lightbox-close" onClick={close} aria-label="Zamknij podgląd">×</button>
                            </div>
                        </div>
                        <div className="exam-image-lightbox-stage">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                className="exam-image-lightbox-image"
                                src={src}
                                alt={alt}
                                style={imageStyle}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
