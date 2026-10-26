/**
 * Tiny hash router helpers. The hash looks like "#/voicings?shape=x3133x&root=C".
 * Modules read params on mount and may push new ones; the app reads the module id.
 */
export function parseHash(hash = location.hash): { module: string; params: URLSearchParams } {
  const body = hash.replace(/^#\/?/, '')
  const [module, query = ''] = body.split('?')
  return { module, params: new URLSearchParams(query) }
}

export function navigate(module: string, params?: Record<string, string>) {
  const q = params ? new URLSearchParams(params).toString() : ''
  location.hash = `#/${module}${q ? `?${q}` : ''}`
}
