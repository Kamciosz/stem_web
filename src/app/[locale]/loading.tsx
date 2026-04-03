export default function Loading() {
    return (
        <div className="min-h-screen pt-28 pb-20 stone-texture">
            <div className="mx-auto max-w-7xl px-6 md:px-10">
                <div className="animate-pulse space-y-8">
                    <div className="h-12 w-64 rounded-xl bg-[var(--color-purple-950)]/50" />
                    <div className="h-6 w-96 rounded-lg bg-[var(--color-purple-950)]/30" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="glass-card rounded-2xl p-6 space-y-4"
                            >
                                <div className="aspect-video rounded-xl bg-[var(--color-purple-950)]/40" />
                                <div className="h-5 w-3/4 rounded-lg bg-[var(--color-purple-950)]/30" />
                                <div className="h-4 w-full rounded-lg bg-[var(--color-purple-950)]/20" />
                                <div className="h-4 w-2/3 rounded-lg bg-[var(--color-purple-950)]/20" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
