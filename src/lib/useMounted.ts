import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

/**
 * Hydration-safe mounting hook adhering to React 19 / Next.js guidelines.
 * Returns `false` on server and during initial hydration, and `true` on client once mounted.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
