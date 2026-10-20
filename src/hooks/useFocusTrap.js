import { useEffect } from 'react'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Trap keyboard focus inside the referenced container while `active`.
 * - On activate: store the previously focused element and focus the first
 *   focusable descendant; mark sibling nodes aria-hidden + inert.
 * - Tab on last -> first; Shift+Tab on first -> last.
 * - Esc: invoke onEscape (caller closes); focus is restored to the prior element
 *   on deactivate.
 *
 * @param {React.RefObject<HTMLElement>} ref
 * @param {boolean} active
 * @param {() => void} [onEscape]
 */
export function useFocusTrap(ref, active, onEscape) {
  useEffect(() => {
    if (!active) return undefined
    const container = ref.current
    if (!container || typeof document === 'undefined') return undefined

    const previouslyFocused = document.activeElement

    const getFocusable = () =>
      Array.from(container.querySelectorAll(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement
      )

    // hide/inert siblings of the container so background is unreachable
    const siblings = Array.from(container.parentElement ? container.parentElement.children : [])
      .filter((el) => el !== container)
    const prevState = siblings.map((el) => ({
      el,
      ariaHidden: el.getAttribute('aria-hidden'),
      inert: el.hasAttribute('inert'),
    }))
    siblings.forEach((el) => {
      el.setAttribute('aria-hidden', 'true')
      el.setAttribute('inert', '')
    })

    const focusable = getFocusable()
    if (focusable.length) {
      focusable[0].focus()
    } else {
      container.focus()
    }

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        if (onEscape) onEscape()
        return
      }
      if (e.key !== 'Tab') return

      const items = getFocusable()
      if (!items.length) {
        e.preventDefault()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      const activeEl = document.activeElement

      if (e.shiftKey && activeEl === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && activeEl === last) {
        e.preventDefault()
        first.focus()
      }
    }

    container.addEventListener('keydown', onKeyDown)

    return () => {
      container.removeEventListener('keydown', onKeyDown)
      prevState.forEach(({ el, ariaHidden, inert }) => {
        if (ariaHidden === null) el.removeAttribute('aria-hidden')
        else el.setAttribute('aria-hidden', ariaHidden)
        if (inert) el.setAttribute('inert', '')
        else el.removeAttribute('inert')
      })
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus()
      }
    }
  }, [ref, active, onEscape])
}

export default useFocusTrap
