"use client";

/**
 * Globalny progress storage dla wszystkich egzaminow.
 * Jeden JSON w localStorage pod STEM_EXAM_PROGRESS_KEY.
 *
 * Schema:
 * {
 *   [examSlug: string]: {
 *     visited: string[],   // slugs etapow ktore uzytkownik odwiedzil
 *     done: boolean[],     // stan checklisty etapow
 *     updatedAt: number,   // timestamp ostatniej zmiany
 *   }
 * }
 *
 * Hook:
 *  - useExamProgress(examSlug, totalChecklist) -> { done, total, visited, hasAny, isComplete, percent }
 *  - useExamProgressMutator(examSlug, total)   -> { state, toggle, reset, markVisited, ... }
 *  - useAllExamProgress()                       -> { [examSlug]: { done, total, percent, visited } }
 *  - useGlobalProgressSummary()                 -> { inProgress: number, completed: number, total: number }
 */

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

const STEM_EXAM_PROGRESS_KEY = "stem-exam-progress-v1";
const SCHEMA_VERSION = 1;

type ExamState = {
    visited: string[];
    done: boolean[];
    updatedAt: number;
};

type ProgressMap = Record<string, ExamState>;

const listeners = new Set<() => void>();

function readMap(): ProgressMap {
    if (typeof window === "undefined") return {};
    try {
        const raw = window.localStorage.getItem(STEM_EXAM_PROGRESS_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object") return {};
        if (parsed.__v !== SCHEMA_VERSION) return {};
        return parsed.data ?? {};
    } catch {
        return {};
    }
}

function writeMap(map: ProgressMap) {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(
            STEM_EXAM_PROGRESS_KEY,
            JSON.stringify({ __v: SCHEMA_VERSION, data: map })
        );
    } catch {
        /* quota / private mode */
    }
}

function getOrInit(slug: string, totalChecklist: number): ExamState {
    const map = readMap();
    if (map[slug]) return map[slug];
    return { visited: [], done: Array.from({ length: totalChecklist }, () => false), updatedAt: 0 };
}

function emit() {
    listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
    listeners.add(cb);
    if (typeof window !== "undefined") {
        const onStorage = (e: StorageEvent) => {
            if (e.key === STEM_EXAM_PROGRESS_KEY) cb();
        };
        window.addEventListener("storage", onStorage);
        return () => {
            listeners.delete(cb);
            window.removeEventListener("storage", onStorage);
        };
    }
    return () => {
        listeners.delete(cb);
    };
}

export type ExamProgressSnapshot = {
    done: number;
    total: number;
    percent: number;
    visited: string[];
    hasAny: boolean;
    isComplete: boolean;
};

function snapshotFor(slug: string, totalChecklist: number): ExamProgressSnapshot {
    const state = getOrInit(slug, totalChecklist);
    const done = state.done.filter(Boolean).length;
    const percent = totalChecklist === 0 ? 0 : Math.round((done / totalChecklist) * 100);
    return {
        done,
        total: totalChecklist,
        percent,
        visited: state.visited,
        hasAny: state.visited.length > 0 || done > 0,
        isComplete: totalChecklist > 0 && done === totalChecklist,
    };
}

const SSR_FALLBACK: ExamProgressSnapshot = {
    done: 0,
    total: 0,
    percent: 0,
    visited: [],
    hasAny: false,
    isComplete: false,
};

/* Cache stabilnej referencji snapshotow per slug, zeby useSyncExternalStore nie loopowal. */
const snapCache = new Map<string, { key: string; value: ExamProgressSnapshot }>();

function getClientSnapshot(slug: string, total: number): ExamProgressSnapshot {
    const s = snapshotFor(slug, total);
    const key = `${s.done}/${s.total}/${s.visited.length}/${s.isComplete}`;
    const cached = snapCache.get(slug);
    if (cached && cached.key === key) return cached.value;
    const value = { ...s };
    snapCache.set(slug, { key, value });
    return value;
}

export function useExamProgress(examSlug: string, totalChecklist: number): ExamProgressSnapshot {
    const get = useCallback(() => getClientSnapshot(examSlug, totalChecklist), [examSlug, totalChecklist]);
    return useSyncExternalStore(subscribe, get, () => SSR_FALLBACK);
}

/**
 * Mutator — pelna kontrola checklisty + visitor tracking.
 * SSR-safe: poczatkowo wszystko false/[], po hydracji synchronizuje z localStorage.
 */
export function useExamProgressMutator(examSlug: string, totalChecklist: number) {
    const [state, setState] = useState<boolean[]>(() => Array.from({ length: totalChecklist }, () => false));
    const [visited, setVisited] = useState<string[]>([]);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        const map = readMap();
        const s = map[examSlug];
        if (s) {
            setState(Array.from({ length: totalChecklist }, (_, i) => Boolean(s.done[i])));
            setVisited(s.visited ?? []);
        }
        setHydrated(true);

        const localListener = () => {
            const map2 = readMap();
            const s2 = map2[examSlug];
            if (s2) {
                setState(Array.from({ length: totalChecklist }, (_, i) => Boolean(s2.done[i])));
                setVisited(s2.visited ?? []);
            }
        };
        listeners.add(localListener);
        return () => {
            listeners.delete(localListener);
        };
    }, [examSlug, totalChecklist]);

    const persist = useCallback(
        (nextDone: boolean[], nextVisited: string[]) => {
            const map = readMap();
            map[examSlug] = {
                done: nextDone,
                visited: nextVisited,
                updatedAt: Date.now(),
            };
            writeMap(map);
            emit();
        },
        [examSlug]
    );

    const toggle = useCallback(
        (index: number, value: boolean) => {
            setState((prev) => {
                const next = [...prev];
                next[index] = value;
                persist(next, visited);
                return next;
            });
        },
        [persist, visited]
    );

    const reset = useCallback(() => {
        const next = Array.from({ length: totalChecklist }, () => false);
        setState(next);
        persist(next, visited);
    }, [persist, totalChecklist, visited]);

    const markVisited = useCallback(
        (stepSlug: string) => {
            setVisited((prev) => {
                if (prev.includes(stepSlug)) return prev;
                const next = [...prev, stepSlug];
                persist(state, next);
                return next;
            });
        },
        [persist, state]
    );

    const done = state.filter(Boolean).length;
    return {
        state,
        toggle,
        reset,
        markVisited,
        hydrated,
        done,
        total: totalChecklist,
        visited,
    };
}

/* Cache stabilnej referencji dla snapshotu ZBIORCZEGO (wszystkie slugi).
 * useSyncExternalStore wymaga, by getSnapshot zwracal te sama referencje,
 * dopoki dane sie nie zmienily. Bez tego React 19/Next 16 wpada w
 * "getServerSnapshot should be cached" + "Maximum update depth exceeded". */
type AllCacheEntry = { key: string; value: Record<string, ExamProgressSnapshot> };
const allClientCache = new Map<string, AllCacheEntry>();
const allSsrCache = new Map<string, Record<string, ExamProgressSnapshot>>();

function getAllClientSnapshot(
    examSlugs: string[],
    totalBySlug: Record<string, number>
): Record<string, ExamProgressSnapshot> {
    const out: Record<string, ExamProgressSnapshot> = {};
    const keyParts: string[] = [];
    for (const slug of examSlugs) {
        const snap = getClientSnapshot(slug, totalBySlug[slug] ?? 0);
        out[slug] = snap;
        keyParts.push(`${slug}:${snap.done}/${snap.total}/${snap.visited.length}/${snap.isComplete ? 1 : 0}`);
    }
    const cacheId = examSlugs.join("|");
    const key = keyParts.join(",");
    const cached = allClientCache.get(cacheId);
    if (cached && cached.key === key) return cached.value;
    allClientCache.set(cacheId, { key, value: out });
    return out;
}

function getAllServerSnapshot(examSlugs: string[]): Record<string, ExamProgressSnapshot> {
    const cacheId = examSlugs.join("|");
    const cached = allSsrCache.get(cacheId);
    if (cached) return cached;
    const out: Record<string, ExamProgressSnapshot> = {};
    for (const slug of examSlugs) out[slug] = SSR_FALLBACK;
    allSsrCache.set(cacheId, out);
    return out;
}

/**
 * Wszystkie egzaminy naraz — dla dashboardu / paska globalnego.
 * Zwraca Record<slug, ExamProgressSnapshot>.
 */
export function useAllExamProgress(examSlugs: string[], totalBySlug: Record<string, number>) {
    const getClient = useCallback(
        () => getAllClientSnapshot(examSlugs, totalBySlug),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [examSlugs.join("|"), JSON.stringify(totalBySlug)]
    );
    const getServer = useCallback(
        () => getAllServerSnapshot(examSlugs),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [examSlugs.join("|")]
    );
    return useSyncExternalStore(subscribe, getClient, getServer);
}

export type GlobalSummary = {
    total: number;
    inProgress: number;
    completed: number;
    notStarted: number;
};

export function useGlobalProgressSummary(all: Record<string, ExamProgressSnapshot>): GlobalSummary {
    let inProgress = 0;
    let completed = 0;
    const total = Object.keys(all).length;
    for (const k in all) {
        const s = all[k];
        if (s.isComplete) completed += 1;
        else if (s.hasAny) inProgress += 1;
    }
    return { total, inProgress, completed, notStarted: total - inProgress - completed };
}
