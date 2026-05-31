type CalloutProps = {
    type?: "info" | "tip" | "warning" | "exam";
    title?: string;
    children: React.ReactNode;
};

const labels: Record<string, string> = {
    info: "INFO",
    tip: "WSKAZÓWKA",
    warning: "UWAGA",
    exam: "NA EGZAMINIE"
};

/**
 * Wyróżniony blok treści. Rozbija ścianę tekstu i zwraca uwagę na ważne rzeczy.
 * Użycie w MDX:
 *   <Callout type="exam">Na egzaminie INF.03 to pytanie pojawia się często.</Callout>
 */
export function Callout({ type = "info", title, children }: CalloutProps) {
    return (
        <aside className={`callout callout-${type}`}>
            <span className="callout-label">{title ?? labels[type]}</span>
            <div className="callout-body">{children}</div>
        </aside>
    );
}
