"use client";

import { useState } from "react";

type IndexNowResponse = {
    submitted: number;
    key: string;
    status: number;
    indexnowResponse: string;
};

export function AdminPanel({
    totalExams,
    totalStages,
    totalUrls,
}: {
    totalExams: number;
    totalStages: number;
    totalUrls: number;
}) {
    const [idxState, setIdxState] = useState<"idle" | "loading" | "ok" | "err">("idle");
    const [idxData, setIdxData] = useState<IndexNowResponse | null>(null);
    const [idxErr, setIdxErr] = useState<string | null>(null);

    async function submitIndexNow() {
        setIdxState("loading");
        setIdxErr(null);
        try {
            const r = await fetch("/api/indexnow", { method: "POST" });
            const data = await r.json();
            setIdxData(data);
            if (data.status === 202 || data.status === 200) setIdxState("ok");
            else setIdxState("err");
        } catch (e) {
            setIdxState("err");
            setIdxErr(String(e));
        }
    }

    return (
        <div className="admin-panel">
            <div className="admin-stats">
                <div className="admin-stat-card">
                    <strong>{totalExams}</strong>
                    <span>Egzaminow</span>
                </div>
                <div className="admin-stat-card">
                    <strong>{totalStages}</strong>
                    <span>Etapow (4 per egzamin)</span>
                </div>
                <div className="admin-stat-card">
                    <strong>{totalUrls}</strong>
                    <span>URL-i w sitemap</span>
                </div>
                <div className="admin-stat-card">
                    <strong>RSS</strong>
                    <span>
                        <a href="/feed.xml" target="_blank" rel="noreferrer">/feed.xml</a>
                    </span>
                </div>
            </div>

            <section className="admin-section">
                <h2>IndexNow submission</h2>
                <p className="admin-section-lead">
                    Wyslij wszystkie URL ze sitemap do Bing IndexNow. Powinno byc wolane 1x po
                    deploy lub duzych zmianach w sitemap.
                </p>
                <button
                    type="button"
                    className="admin-btn primary"
                    onClick={submitIndexNow}
                    disabled={idxState === "loading"}
                >
                    {idxState === "loading" ? "Wysylanie..." : "Wyslij URL-e do IndexNow"}
                </button>
                {idxData && (
                    <pre className="admin-output">
{`Status: ${idxData.status}
Submitted: ${idxData.submitted} URL
Key: ${idxData.key}
Response: ${idxData.indexnowResponse || "(empty)"}`}
                    </pre>
                )}
                {idxErr && <pre className="admin-output is-err">{idxErr}</pre>}
            </section>

            <section className="admin-section">
                <h2>Linki do diagnostyki</h2>
                <ul className="admin-links">
                    <li>
                        <a href="/sitemap.xml" target="_blank" rel="noreferrer">
                            /sitemap.xml
                        </a>{" "}
                        — pelny XML sitemap
                    </li>
                    <li>
                        <a href="/feed.xml" target="_blank" rel="noreferrer">
                            /feed.xml
                        </a>{" "}
                        — RSS feed
                    </li>
                    <li>
                        <a href="/exam-index.json" target="_blank" rel="noreferrer">
                            /exam-index.json
                        </a>{" "}
                        — JSON indeks egzaminow (uzywa SearchPalette)
                    </li>
                    <li>
                        <a href="/robots.txt" target="_blank" rel="noreferrer">
                            /robots.txt
                        </a>{" "}
                        — robots directive
                    </li>
                    <li>
                        <a
                            href="https://www.bing.com/indexnow"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Bing IndexNow portal
                        </a>{" "}
                        — reczny check statusu
                    </li>
                </ul>
            </section>

            <section className="admin-section">
                <h2>Notatki techniczne</h2>
                <ul className="admin-notes">
                    <li>
                        Storage progress: <code>localStorage[stem-exam-progress-v1]</code>{" "}
                        (czysci recznie: <code>localStorage.removeItem(&quot;stem-exam-progress-v1&quot;)</code>)
                    </li>
                    <li>
                        SearchPalette: ladowany leniwie, indeks z{" "}
                        <code>/exam-index.json</code>
                    </li>
                    <li>
                        JSON-LD: Course (root), LearningResource + BreadcrumbList (stage)
                    </li>
                    <li>
                        Weryfikacja IndexNow: plik{" "}
                        <code>public/ac4965d26d4fc3a5b819f99c640cec75.txt</code>
                    </li>
                </ul>
            </section>
        </div>
    );
}
