/** Stands in for virtual:pwa-register in the single-file build, which has no service worker. */
export function registerSW() {
  return () => Promise.resolve()
}
