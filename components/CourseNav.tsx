"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CourseDetail, Module, Lesson } from "@/lib/courses";

type CourseNavProps = {
    course: CourseDetail;
    collapsed: boolean;
    onCollapsedChange: (collapsed: boolean) => void;
};

export function CourseNav({ course, collapsed, onCollapsedChange }: CourseNavProps) {
    const [open, setOpen] = useState(false);
    const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
    const pathname = usePathname();

    // Auto-expand moduł z aktywną lekcją
    useEffect(() => {
        const activeModule = course.modules.find((m) =>
            m.lessons.some((l) => pathname.includes(`/kursy/${course.id}/${l.slug}`))
        );
        if (activeModule && !expandedModules.has(activeModule.id)) {
            setExpandedModules((prev) => new Set([...prev, activeModule.id]));
        }
    }, [pathname, course, expandedModules]);

    const toggleModule = (moduleId: string) => {
        setExpandedModules((prev) => {
            const next = new Set(prev);
            if (next.has(moduleId)) {
                next.delete(moduleId);
            } else {
                next.add(moduleId);
            }
            return next;
        });
    };

    // Zamknij menu po nawigacji (mobile)
    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    // Lock body scroll gdy menu otwarte
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    const visibleModules = course.modules.filter((m) => !m.hidden);
    const totalLessons = visibleModules.reduce((acc, m) => acc + m.lessons.length, 0);
    const publishedLessons = visibleModules.reduce(
        (acc, m) => acc + m.lessons.filter((l) => l.published).length,
        0
    );
    const progressPercent = totalLessons > 0 ? Math.round((publishedLessons / totalLessons) * 100) : 0;

    return (
        <>
            {/* Hamburger button — mobile only */}
            <button
                className="course-nav-hamburger"
                onClick={() => setOpen(!open)}
                aria-label="Menu kursu"
                aria-expanded={open}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    {open ? (
                        <>
                            <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" />
                            <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" />
                        </>
                    ) : (
                        <>
                            <line x1="3" y1="6" x2="21" y2="6" strokeWidth="2" />
                            <line x1="3" y1="12" x2="21" y2="12" strokeWidth="2" />
                            <line x1="3" y1="18" x2="21" y2="18" strokeWidth="2" />
                        </>
                    )}
                </svg>
            </button>

            {/* Overlay — mobile only */}
            {open && (
                <div
                    className="course-nav-overlay"
                    onClick={() => setOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <aside className={`course-nav ${open ? "open" : ""} ${collapsed ? "collapsed" : ""}`} aria-label="Nawigacja kursu">
                {/* Desktop collapse toggle */}
                <button
                    className="course-nav-collapse-toggle"
                    onClick={() => onCollapsedChange(!collapsed)}
                    aria-label={collapsed ? "Rozwiń menu" : "Zwiń menu"}
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                        {collapsed ? (
                            <path d="M7 4l6 6-6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        ) : (
                            <path d="M13 4l-6 6 6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        )}
                    </svg>
                </button>

                <div className="course-nav-header">
                    <Link href="/kursy" className="course-nav-back">
                        ← Kursy
                    </Link>
                    <h2 className="course-nav-title">{course.title}</h2>
                    <div className="course-nav-progress">
                        <div className="course-nav-progress-bar">
                            <div
                                className="course-nav-progress-fill"
                                style={{
                                    width: `${progressPercent}%`
                                }}
                            />
                        </div>
                        <span className="course-nav-progress-label">
                            {publishedLessons} / {totalLessons} lekcji ({progressPercent}%)
                        </span>
                    </div>
                </div>

                <nav className="course-nav-modules">
                    {visibleModules.map((module, mi) => {
                        const modulePublished = module.lessons.filter((l) => l.published).length;
                        const moduleTotal = module.lessons.length;
                        const isModuleActive = module.lessons.some((l) =>
                            pathname.includes(`/kursy/${course.id}/${l.slug}`)
                        );
                        const isExpanded = expandedModules.has(module.id);

                        return (
                            <div
                                key={module.id}
                                className={`course-nav-module ${isModuleActive ? "active" : ""}`}
                            >
                                <button
                                    className="course-nav-module-header"
                                    onClick={() => toggleModule(module.id)}
                                    aria-expanded={isExpanded}
                                >
                                    <span className="course-nav-module-index">
                                        {String(mi + 1).padStart(2, "0")}
                                    </span>
                                    <div className="course-nav-module-info">
                                        <h3 className="course-nav-module-title">{module.title}</h3>
                                        <span className="course-nav-module-count">
                                            {modulePublished}/{moduleTotal}
                                        </span>
                                    </div>
                                    <svg
                                        className={`course-nav-module-chevron ${isExpanded ? "open" : ""}`}
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <polyline points="4,6 8,10 12,6" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </button>
                                {isExpanded && (
                                    <ul className="course-nav-lessons">
                                        {module.lessons.map((lesson) => {
                                            const lessonPath = `/kursy/${course.id}/${lesson.slug}`;
                                            const isActive = pathname === lessonPath;

                                            return (
                                                <li key={lesson.slug}>
                                                    {lesson.published ? (
                                                        <Link
                                                            href={lessonPath}
                                                            className={`course-nav-lesson ${isActive ? "active" : ""}`}
                                                        >
                                                            <span className="course-nav-lesson-marker">
                                                                {isActive ? "▸" : "·"}
                                                            </span>
                                                            <span className="course-nav-lesson-title">
                                                                {lesson.title}
                                                            </span>
                                                            {lesson.minutes && (
                                                                <span className="course-nav-lesson-time">
                                                                    {lesson.minutes}m
                                                                </span>
                                                            )}
                                                        </Link>
                                                    ) : (
                                                        <div className="course-nav-lesson locked">
                                                            <span className="course-nav-lesson-marker">·</span>
                                                            <span className="course-nav-lesson-title">
                                                                {lesson.title}
                                                            </span>
                                                            <span className="course-nav-lesson-status">
                                                                Wkrótce
                                                            </span>
                                                        </div>
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}
