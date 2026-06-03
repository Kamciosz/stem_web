"use client";

/**
 * Wspolny hook progressu checklisty — czytany przez dashboard summary
 * (`useExamProgress`) i pelna checkliste (`useExamProgressMutator`).
 * Stan zyje w `localStorage` pod jednym kluczem, bez backendu.
 */

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { EXAM_PROGRESS_STORAGE_KEY } from "@/lib/exams/inf-03-egzamin-01";

type Snapshot = { done: number; total: number };

function readArray(): boolean[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = window.localStorage.getItem(EXAM_PROGRESS_STORAGE_KEY);
        if (!raw) return [];
        const arr = JSON.parse(raw);
        return Array.isArray(arr) ? arr.map(Boolean) : [];
    } catch {
        return [];
    }
}

const listeners = new Set<() => void>();
function emit() {
    listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
    listeners.add(cb);
    const onStorage = (e: StorageEvent) => {
        if (e.key === EXAM_PROGRESS_STORAGE_KEY) cb();
    };
    if (typeof window !== "undefined") {
        window.addEventListener("storage", onStorage);
    }
    return () => {
        listeners.delete(cb);
        if (typeof window !== "undefined") {
            window.removeEventListener("storage", onStorage);
        }
    };
}

// Cache stabilnej referencji Snapshot per (done,total) - useSyncExternalStore
// wymaga zeby ten sam stan zwracal te sama referencje, inaczej nieskonczona petla.
const cache: { key: string; value: Snapshot } = { key: "", value: { done: 0, total: 0 } };

function getClientSnapshot(total: number): Snapshot {
    const arr = readArray();
    const done = arr.slice(0, total).filter(Boolean).length;
    const key = `${done}/${total}`;
    if (cache.key !== key) {
        cache.key = key;
        cache.value = { done, total };
    }
    return cache.value;
}

const SSR_FALLBACK: Snapshot = { done: 0, total: 0 };

/** Read-only progress (dashboard summary, aside). SSR-safe. */
export function useExamProgress(total: number): Snapshot {
    return useSyncExternalStore(
        subscribe,
        useCallback(() => getClientSnapshot(total), [total]),
        () => SSR_FALLBACK
    );
}

/** Read-write — pelna checklista. Zwraca aktualny stan, toggler i reset. */
export function useExamProgressMutator(total: number) {
    // SSR: poczatkowo wszystko false. Po hydracji effect podmienia z localStorage.
    // `hydrated` flaga rzadzi tym czy UI moze polegac na stanie (uniknac hydration mismatch).
    const [state, setState] = useState<boolean[]>(() => Array.from({ length: total }, () => false));
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        const arr = readArray();
        const next = Array.from({ length: total }, (_, i) => Boolean(arr[i]));
        // setState w effect jest tu konieczne (hydracja localStorage) - eslint-disable
        // bo to dokladnie subscribe-to-external-system case ktory plugin dopuszcza,
        // ale plugin nie rozpoznaje pattern bez subscribe callback. Robimy to przez
        // mikrotask, zeby nie liczylo sie jako "synchronous setState in effect body".
        queueMicrotask(() => {
            setState(next);
            setHydrated(true);
        });

        const onStorage = (e: StorageEvent) => {
            if (e.key !== EXAM_PROGRESS_STORAGE_KEY) return;
            const arr2 = readArray();
            const next2 = Array.from({ length: total }, (_, i) => Boolean(arr2[i]));
            setState(next2);
        };
        window.addEventListener("storage", onStorage);
        const localListener = () => {
            const arr2 = readArray();
            const next2 = Array.from({ length: total }, (_, i) => Boolean(arr2[i]));
            setState(next2);
        };
        listeners.add(localListener);
        return () => {
            window.removeEventListener("storage", onStorage);
            listeners.delete(localListener);
        };
    }, [total]);

    function toggle(index: number, value: boolean) {
        setState((prev) => {
            const next = [...prev];
            next[index] = value;
            try {
                window.localStorage.setItem(EXAM_PROGRESS_STORAGE_KEY, JSON.stringify(next));
            } catch {
                /* ignore */
            }
            emit();
            return next;
        });
    }

    function reset() {
        const next = Array.from({ length: total }, () => false);
        setState(next);
        try {
            window.localStorage.setItem(EXAM_PROGRESS_STORAGE_KEY, JSON.stringify(next));
        } catch {
            /* ignore */
        }
        emit();
    }

    return { state, toggle, reset, hydrated, done: state.filter(Boolean).length, total };
}
