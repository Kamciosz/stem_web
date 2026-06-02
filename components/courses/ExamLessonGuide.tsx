"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { ExamPicker } from "@/components/ExamPicker";
import { examSessions } from "@/lib/courses";
import { Term } from "@/components/courses/Term";

type Stat = {
    label: string;
    value: string;
};

type NavItem = {
    href: string;
    label: string;
};

type PlanStep = {
    title: string;
    summary: string;
    points: string;
    mistake: string;
    details: ReactNode;
};

type Material = {
    src: string;
    alt: string;
    title: string;
    caption: string;
};

type TimelineStep = {
    time: string;
    title: string;
    body: string;
    tag: string;
};

type WarningItem = {
    title: string;
    impact: string;
    check: string;
};

type ScoreItem = {
    area: string;
    points: string;
    criterion: string;
};

type ChecklistItem = {
    label: ReactNode;
};

export function ExamGuideShell({ children }: { children: ReactNode }) {
    return <div className="exam-guide">{children}</div>;
}

export function ExamHero({
    kicker,
    title,
    description,
    stats,
    rule,
}: {
    kicker: string;
    title: string;
    description: string;
    stats: Stat[];
    rule: string;
}) {
    return (
        <header className="exam-guide-hero" aria-labelledby="exam-guide-title">
            <div className="exam-guide-hero-copy">
                <p className="exam-guide-kicker">{kicker}</p>
                <h2 id="exam-guide-title">{title}</h2>
                <p>{description}</p>
            </div>
            <div className="exam-guide-hero-side" aria-label="Najważniejsze informacje">
                <dl className="exam-guide-stats">
                    {stats.map((stat) => (
                        <div key={stat.label}>
                            <dt>{stat.label}</dt>
                            <dd>{stat.value}</dd>
                        </div>
                    ))}
                </dl>
                <div className="exam-guide-rule">
                    <span>Zasada kolejności</span>
                    <strong>{rule}</strong>
                </div>
                <ExamPicker sessions={examSessions} courseId="inf-03" label="Wybierz inny arkusz" />
            </div>
        </header>
    );
}

export function ExamQuickNav({ items }: { items: NavItem[] }) {
    const [active, setActive] = useState(items[0]?.href ?? "");

    useEffect(() => {
        const ids = items.map((item) => item.href.replace(/^#/, ""));
        const nodes = ids
            .map((id) => document.getElementById(id))
            .filter((node): node is HTMLElement => Boolean(node));

        if (!nodes.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
                if (visible?.target.id) setActive(`#${visible.target.id}`);
            },
            { rootMargin: "-24% 0px -62%", threshold: [0.1, 0.25, 0.5] }
        );

        nodes.forEach((node) => observer.observe(node));
        return () => observer.disconnect();
    }, [items]);

    return (
        <nav className="exam-guide-nav" aria-label="Szybkie przejścia egzaminu">
            {items.map((item) => (
                <a key={item.href} href={item.href} className={active === item.href ? "active" : undefined}>
                    {item.label}
                </a>
            ))}
        </nav>
    );
}

export function ExamSection({
    id,
    eyebrow,
    title,
    lead,
    children,
}: {
    id: string;
    eyebrow?: string;
    title: string;
    lead?: string;
    children: ReactNode;
}) {
    return (
        <section id={id} className="exam-guide-section" aria-labelledby={`${id}-title`}>
            <div className="exam-guide-section-head">
                {eyebrow && <p>{eyebrow}</p>}
                <h2 id={`${id}-title`}>{title}</h2>
                {lead && <div className="exam-copy">{lead}</div>}
            </div>
            {children}
        </section>
    );
}

export function ExamPlan({ steps }: { steps: PlanStep[] }) {
    return (
        <div className="exam-plan-grid">
            {steps.map((step, index) => (
                <details className="exam-plan-step" key={step.title}>
                    <summary>
                        <span className="exam-plan-index">{String(index + 1).padStart(2, "0")}</span>
                        <span className="exam-plan-title-wrap">
                            <strong>{step.title}</strong>
                            <em>{step.summary}</em>
                        </span>
                        <span className="exam-plan-action">Rozwiń</span>
                    </summary>
                    <div className="exam-plan-details">
                        <div>
                            <span>Za co punkty</span>
                            <p>{step.points}</p>
                        </div>
                        <div>
                            <span>Najczęstszy błąd</span>
                            <p>{step.mistake}</p>
                        </div>
                        <div className="exam-plan-extra">{step.details}</div>
                    </div>
                </details>
            ))}
        </div>
    );
}

export function ExamMaterials({ materials, result }: { materials: Material[]; result: Material }) {
    return (
        <div className="exam-materials-layout">
            <div className="exam-materials-grid" aria-label="Pliki z arkusza">
                {materials.map((item) => (
                    <figure key={item.src}>
                        <a href={item.src} target="_blank" rel="noopener">
                            <img src={item.src} alt={item.alt} loading="lazy" />
                        </a>
                        <figcaption>
                            <strong>{item.title}</strong>
                            <span>{item.caption}</span>
                        </figcaption>
                    </figure>
                ))}
            </div>
            <figure className="exam-materials-result">
                <a href={result.src} target="_blank" rel="noopener">
                    <img src={result.src} alt={result.alt} loading="lazy" />
                </a>
                <figcaption>
                    <strong>{result.title}</strong>
                    <span>{result.caption}</span>
                </figcaption>
            </figure>
        </div>
    );
}

export function ExamTimeline({ steps }: { steps: TimelineStep[] }) {
    return (
        <ol className="exam-timeline-guide">
            {steps.map((step) => (
                <li key={step.time}>
                    <time>{step.time}</time>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                    <span>{step.tag}</span>
                </li>
            ))}
        </ol>
    );
}

export function ExamWarnings({ items }: { items: WarningItem[] }) {
    return (
        <div className="exam-warning-grid">
            {items.map((item) => (
                <article key={item.title}>
                    <h3>{item.title}</h3>
                    <dl>
                        <div>
                            <dt>Skutek</dt>
                            <dd>{item.impact}</dd>
                        </div>
                        <div>
                            <dt>Gdzie sprawdzić</dt>
                            <dd>{item.check}</dd>
                        </div>
                    </dl>
                </article>
            ))}
        </div>
    );
}

export function ExamCodeBlock({
    title,
    description,
    language,
    code,
    mistake,
}: {
    title: string;
    description: string;
    language: string;
    code: string;
    mistake: string;
}) {
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const contentId = useId();

    async function copyCode() {
        try {
            await navigator.clipboard.writeText(code.trim());
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
        } catch {
            setCopied(false);
        }
    }

    return (
        <article className="exam-code-card">
            <header>
                <span>{language}</span>
                <h3>{title}</h3>
                <p>{description}</p>
            </header>
            <div className="exam-code-actions">
                <button type="button" aria-expanded={open} aria-controls={contentId} onClick={() => setOpen((v) => !v)}>
                    {open ? "Ukryj kod" : "Pokaż kod"}
                </button>
                <button type="button" onClick={copyCode}>
                    {copied ? "Skopiowano" : "Kopiuj"}
                </button>
            </div>
            {open && (
                <pre id={contentId} className={`language-${language.toLowerCase()}`}>
                    <code>{code.trim()}</code>
                </pre>
            )}
            <details className="exam-code-mistake">
                <summary>Typowy błąd</summary>
                <p>{mistake}</p>
            </details>
        </article>
    );
}

export function ExamCodeGrid({ children }: { children: ReactNode }) {
    return <div className="exam-code-grid">{children}</div>;
}

export function ExamScoring({ items }: { items: ScoreItem[] }) {
    return (
        <div className="exam-score-grid">
            {items.map((item) => (
                <article key={item.area}>
                    <strong>{item.points}</strong>
                    <h3>{item.area}</h3>
                    <p>{item.criterion}</p>
                </article>
            ))}
        </div>
    );
}

export function ExamChecklist({ items }: { items: ChecklistItem[] }) {
    const [checked, setChecked] = useState<boolean[]>(() => items.map(() => false));
    const done = checked.filter(Boolean).length;

    return (
        <div className="exam-local-checklist">
            <div className="exam-checklist-progress" aria-live="polite">
                <span>Odhaczone lokalnie</span>
                <strong>{done}/{items.length}</strong>
            </div>
            {items.map((item, index) => (
                <label key={index} className={checked[index] ? "done" : undefined}>
                    <input
                        type="checkbox"
                        checked={checked[index]}
                        onChange={(event) => {
                            const next = [...checked];
                            next[index] = event.target.checked;
                            setChecked(next);
                        }}
                    />
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span>{item.label}</span>
                </label>
            ))}
        </div>
    );
}

export function ExamTooltip({ word, define, children }: { word?: string; define?: string; children: ReactNode }) {
    return (
        <Term word={word} define={define}>
            {children}
        </Term>
    );
}
