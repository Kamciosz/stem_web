import Link from "next/link";
import { Fragment } from "react";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
    if (items.length === 0) return null;
    return (
        <nav className="breadcrumbs" aria-label="Okruszki nawigacji">
            <ol className="breadcrumbs-list">
                {items.map((c, i) => (
                    <Fragment key={i}>
                        <li className="breadcrumbs-item">
                            {c.href ? (
                                <Link href={c.href} className="breadcrumbs-link">
                                    {c.label}
                                </Link>
                            ) : (
                                <span className="breadcrumbs-current" aria-current="page">
                                    {c.label}
                                </span>
                            )}
                        </li>
                        {i < items.length - 1 && (
                            <li className="breadcrumbs-sep" aria-hidden="true">/</li>
                        )}
                    </Fragment>
                ))}
            </ol>
        </nav>
    );
}
