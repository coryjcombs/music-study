/**
 * Service worker registration for the hosted build. The single-file build has no
 * worker (file:// cannot run one), and the dev server does not register it either.
 * With registerType 'autoUpdate' a new deploy takes effect on the next open.
 */
export function registerServiceWorker() {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator) || location.protocol === 'file:') return
  void import('virtual:pwa-register').then(({ registerSW }) => registerSW({ immediate: true })).catch(() => {})
}
