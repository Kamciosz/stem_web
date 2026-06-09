"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

type ExamImagePreviewProps = {
    src: string;
    alt: string;
    title?: string;
    className?: string;
};

function clampZoom(value: number) {
    return Math.min(6, Math.max(0.5, Number(value.toFixed(2))));
}

function fitZoom(naturalWidth: number, naturalHeight: number) {
    if (!naturalWidth || !naturalHeight || typeof window === "undefined") return 1;
    const toolbarSpace = window.innerWidth <= 560 ? 120 : 110;
    const maxWidth = Math.max(240, window.innerWidth - 48);
    const maxHeight = Math.max(240, window.innerHeight - toolbarSpace);
    const fit = Math.min(maxWidth / naturalWidth, maxHeight / naturalHeight);
    return clampZoom(Math.max(1, fit));
}

export function ExamImagePreview({ src, alt, title, className }: ExamImagePreviewProps) {
    const [open, setOpen] = useState(false);
    const [zoom, setZoom] = useState(1);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const titleId = useId();

    function resetZoom() {
        const image = imageRef.current;
        setZoom(image ? fitZoom(image.naturalWidth, image.naturalHeight) : 1);
    }

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
            if (event.key === "0") resetZoom();
        };
        document.body.style.overflow = "hidden";
        document.documentElement.classList.add("exam-lightbox-open");
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = previousOverflow;
            document.documentElement.classList.remove("exam-lightbox-open");
            window.removeEventListener("keydown", onKey);
        };
    }, [open]);

    const label = title ?? alt;
    const zoomPercent = Math.round(zoom * 100);
    const imageStyle = { "--exam-image-zoom": String(zoom) };
    const lightbox = open ? (
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
                        <div className="exam-image-lightbox-zoomgroup" role="group" aria-label="Powiększenie obrazu">
                            <button type="button" onClick={() => setZoom((value) => clampZoom(value - 0.25))} aria-label="Pomniejsz obraz">−</button>
                            <span className="exam-image-lightbox-zoom" aria-live="polite">{zoomPercent}%</span>
                            <button type="button" onClick={() => setZoom((value) => clampZoom(value + 0.25))} aria-label="Powiększ obraz">+</button>
                            <button type="button" className="exam-image-lightbox-fit" onClick={resetZoom} aria-label="Dopasuj obraz do okna">Fit</button>
                        </div>
                        <a className="exam-image-lightbox-secondary" href={src} target="_blank" rel="noopener noreferrer">Otwórz plik</a>
                        <button type="button" className="exam-image-lightbox-close" onClick={close} aria-label="Zamknij podgląd">×</button>
                    </div>
                </div>
                <div className="exam-image-lightbox-stage">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        className="exam-image-lightbox-image"
                        src={src}
                        alt={alt}
                        ref={imageRef}
                        onLoad={(event) => setZoom(fitZoom(event.currentTarget.naturalWidth, event.currentTarget.naturalHeight))}
                        style={imageStyle}
                    />
                </div>
            </div>
        </div>
    ) : null;

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

            {typeof document !== "undefined" && lightbox ? createPortal(lightbox, document.body) : null}
        </>
    );
}
