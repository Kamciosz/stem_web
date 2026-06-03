import Link from "next/link";
import {
    examFlowBasePath,
    examMaterials,
    examMeta,
    examStrategy,
    examSteps,
} from "@/lib/exams/inf-03-egzamin-01";
import {
    ExamFlowHeader,
    ExamFlowInfoPanel,
    ExamFlowShell,
    ExamFlowStepNav,
} from "./ExamFlowChrome";

/**
 * Dashboard egzaminu — entry point /kursy/inf-03/egzamin-01-styczen-2026.
 * Server component. Client islands tylko tam gdzie potrzebne (`ExamFlowStepNav`,
 * `ExamFlowInfoPanel`).
 */
export function ExamFlowDashboard() {
    return (
        <ExamFlowShell>
            <ExamFlowHeader />
            <ExamFlowStepNav />

            <div className="exam-flow-dashboard">
                <section className="exam-flow-dashboard-main">
                    <section className="exam-flow-stages" aria-label="Etapy">
                        <h2 className="exam-flow-section-title">Etapy</h2>
                        <p className="exam-flow-section-lead">
                            Cztery etapy w kolejnosci pracy. Kazdy na osobnej stronie z wlasnym kodem,
                            bledami i punktacja.
                        </p>
                        <ol className="exam-flow-stages-grid">
                            {examSteps.map((step) => (
                                <li key={step.slug}>
                                    <Link href={`${examFlowBasePath}/${step.slug}`} className="exam-flow-stage-card">
                                        <span className="exam-flow-stage-index">
                                            {String(step.index).padStart(2, "0")}
                                        </span>
                                        <span className="exam-flow-stage-title">{step.label}</span>
                                        <span className="exam-flow-stage-summary">{step.summary}</span>
                                        <span className="exam-flow-stage-meta">
                                            <span>{step.minutes}</span>
                                            <span>{step.technologies.join(" · ")}</span>
                                        </span>
                                        <span className="exam-flow-stage-cta" aria-hidden="true">
                                            Otworz →
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ol>
                    </section>

                    <section className="exam-flow-materials" aria-label="Materialy arkusza">
                        <h2 className="exam-flow-section-title">Materialy</h2>
                        <p className="exam-flow-section-lead">
                            Trzy obrazki z arkusza i makieta koncowa. Po lewej minatury, po prawej cel.
                        </p>
                        <div className="exam-flow-materials-layout">
                            <div className="exam-flow-materials-thumbs">
                                {examMaterials.files.map((file) => (
                                    <figure key={file.src}>
                                        <a href={file.src} target="_blank" rel="noopener noreferrer">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={file.src} alt={file.alt} loading="lazy" />
                                        </a>
                                        <figcaption>
                                            <strong>{file.title}</strong>
                                            <span>{file.caption}</span>
                                        </figcaption>
                                    </figure>
                                ))}
                            </div>
                            <figure className="exam-flow-materials-result">
                                <a href={examMaterials.result.src} target="_blank" rel="noopener noreferrer">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={examMaterials.result.src} alt={examMaterials.result.alt} loading="lazy" />
                                </a>
                                <figcaption>
                                    <strong>{examMaterials.result.title}</strong>
                                    <span>{examMaterials.result.caption}</span>
                                </figcaption>
                            </figure>
                        </div>
                    </section>

                    <section className="exam-flow-strategy" aria-label="Strategia czasu">
                        <h2 className="exam-flow-section-title">Strategia</h2>
                        <p className="exam-flow-section-lead">
                            Najpierw dzialajace dane, potem wyglad. Tak sie nie traci punktow na koncu.
                        </p>
                        <ol className="exam-flow-strategy-list">
                            {examStrategy.map((step) => (
                                <li key={step.time}>
                                    <time>{step.time}</time>
                                    <div>
                                        <strong>{step.title}</strong>
                                        <p>{step.body}</p>
                                    </div>
                                    <span className="exam-flow-strategy-tag">{step.tag}</span>
                                </li>
                            ))}
                        </ol>
                        <p className="exam-flow-strategy-objective">
                            <span>Cel arkusza</span>
                            {examMeta.objective}.
                        </p>
                    </section>
                </section>

                <ExamFlowInfoPanel />
            </div>
        </ExamFlowShell>
    );
}
