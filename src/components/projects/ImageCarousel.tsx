"use client";

import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
    images: { url: string; alt: string }[];
    fallbackLetter?: string;
}

export default function ImageCarousel({ images, fallbackLetter = "S" }: ImageCarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        dragFree: false,
    });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
        return () => {
            emblaApi.off("select", onSelect);
            emblaApi.off("reInit", onSelect);
        };
    }, [emblaApi, onSelect]);

    // Auto-play: slide every 4 seconds
    useEffect(() => {
        if (!emblaApi || images.length <= 1) return;
        const interval = setInterval(() => {
            emblaApi.scrollNext();
        }, 4000);
        return () => clearInterval(interval);
    }, [emblaApi, images.length]);

    // No images — show fallback
    if (images.length === 0) {
        return (
            <div className="aspect-video rounded-2xl bg-gradient-to-br from-[var(--color-purple-950)] to-[var(--color-bg-card)] flex items-center justify-center overflow-hidden">
                <span className="text-8xl font-bold text-[var(--color-purple-800)]/20">
                    {fallbackLetter}
                </span>
            </div>
        );
    }

    // Single image — no carousel
    if (images.length === 1) {
        return (
            <div className="aspect-video rounded-2xl overflow-hidden bg-[var(--color-bg-card)]">
                <img
                    src={images[0].url}
                    alt={images[0].alt}
                    className="w-full h-full object-cover"
                />
            </div>
        );
    }

    return (
        <div className="relative group">
            {/* Viewport */}
            <div ref={emblaRef} className="overflow-hidden rounded-2xl">
                <div className="flex">
                    {images.map((img, i) => (
                        <div key={i} className="flex-[0_0_100%] min-w-0">
                            <div className="aspect-video bg-[var(--color-bg-card)]">
                                <img
                                    src={img.url}
                                    alt={img.alt}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Prev / Next buttons */}
            <button
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
                aria-label="Previous"
            >
                <ChevronLeft size={20} />
            </button>
            <button
                onClick={scrollNext}
                disabled={!canScrollNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
                aria-label="Next"
            >
                <ChevronRight size={20} />
            </button>

            {/* Dot indicators */}
            {images.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => emblaApi?.scrollTo(i)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === selectedIndex
                                    ? "bg-[var(--color-purple-400)] w-6"
                                    : "bg-white/20 hover:bg-white/40"
                                }`}
                            aria-label={`Slide ${i + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
