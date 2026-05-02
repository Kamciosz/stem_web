import type { ReactNode } from "react";
import { CornerBrackets } from "./CornerBrackets";

type DepthCardProps = {
    children: ReactNode;
    className?: string;
};

export function DepthCard({ children, className = "" }: DepthCardProps) {
    return (
        <article className={`depth-card ${className}`}>
            <CornerBrackets />
            {children}
        </article>
    );
}
