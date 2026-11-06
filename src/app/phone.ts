/**
 * Phone layout switch. The same build serves desktop and phone; CSS does most of
 * the work under this media query, and a few components ask here when behaviour
 * (not just layout) should differ, such as scrolling a chosen entry into view.
 */
import { useEffect, useState } from 'react'

export const PHONE_QUERY = '(max-width: 720px)'

export function isPhone(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(PHONE_QUERY).matches
}

/** On a phone, bring an element into view after a selection; no-op on desktop. */
export function revealOnPhone(el: HTMLElement | null) {
  if (el && isPhone()) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/** Reactive version for components that change structure, not just style. */
export function usePhone(): boolean {
  const [phone, setPhone] = useState(isPhone)
  useEffect(() => {
    const mq = window.matchMedia(PHONE_QUERY)
    const onChange = () => setPhone(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return phone
}
