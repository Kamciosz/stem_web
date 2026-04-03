import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center stone-texture">
            <div className="text-center px-6">
                <h1 className="text-8xl md:text-9xl font-bold gradient-text mb-4">
                    404
                </h1>
                <p className="text-xl text-[var(--color-text-secondary)] mb-8">
                    Strona nie została znaleziona
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--color-purple-600)] hover:bg-[var(--color-purple-500)] text-white font-medium transition-all duration-300 glow-purple"
                >
                    <ArrowLeft size={18} />
                    Powrót na stronę główną
                </Link>
            </div>
        </div>
    );
}
