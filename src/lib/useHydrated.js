import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * False while React hydrates the pre-rendered HTML, true right after. Use it
 * for anything the build can't know, like the visitor's clock or OS, so the
 * first client render matches the server's.
 */
export default function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
