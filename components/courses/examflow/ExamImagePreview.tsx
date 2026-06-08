"use client";

import { useEffect, useState } from "react";

type ExamImagePreviewProps = {
    src: string;
    alt: string;
    title?: string;
    className?: string;
};

export function ExamImagePreview({ src, alt, title, className }: ExamImagePreviewProps) {
    const [open, setOpen] = useState(false);
    const [zoom, setZoom] = useState(1);

    useEffect(() => {
        if (!open) return;
        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false);
            if (event.key === "+" || event.key === "=") setZoom((value) => Math.min(3, Number((value + 0.25).toFixed(2))));
            if (event.key === "-") setZoom((value) => Math.max(0.5, Number((value - 0.25).toFixed(2))));
            if (event.key === "0") setZoom(1);
        };
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", onKey);
        };
    }, [open]);

    function close() {
        setOpen(false);
        setZoom(1);
    }

    return (
        <>
            <button
                type="button"
                className={`exam-image-preview${className ? ` ${className}` : ""}`}
                onClick={() => setOpen(true)}
                aria-label={`Powiększ obraz: ${title ?? alt}`}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={alt} loading="lazy" />
                <span className="exam-image-preview-badge" aria-hidden="true">Powiększ</span>
            </button>

            {open && (
                <div className="exam-image-lightbox" role="dialog" aria-modal="true" aria-label={title ?? alt}>
                    <button type="button" className="exam-image-lightbox-backdrop" onClick={close} aria-label="Zamknij podgląd" />
                    <div className="exam-image-lightbox-panel">
                        <div className="exam-image-lightbox-toolbar">
                            <div>
                                <strong>{title ?? alt}</strong>
                                <span>{Math.round(zoom * 100)}%</span>
                            </div>
                            <div className="exam-image-lightbox-actions">
                                <button type="button" onClick={() => setZoom((value) => Math.max(0.5, Number((value - 0.25).toFixed(2))))}>−</button>
                                <button type="button" onClick={() => setZoom(1)}>100%</button>
                                <button type="button" onClick={() => setZoom((value) => Math.min(3, Number((value + 0.25).toFixed(2))))}>+</button>
                                <a href={src} target="_blank" rel="noopener noreferrer">Otwórz plik</a>
                                <button type="button" onClick={close}>Zamknij</button>
                            </div>
                        </div>
                        <div className="exam-image-lightbox-stage">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={src}
                                alt={alt}
                                style={{ transform: `scale(${zoom})` }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
