import { useEffect } from 'react'

/**
 * While the tab/document is hidden, toggle a `data-anim-paused` attribute on
 * <html> so the global CSS rule in index.css can pause every infinite
 * decorative animation (grid drift, scanline, radar sweep, glow pulse, blink).
 * This frees the main thread/GPU from repainting the fixed backdrop and HUD
 * chrome when nobody is looking, and resumes seamlessly when the tab is shown
 * again. Purely a performance gate — no visual change while the tab is active.
 */
export function useDocumentHidden() {
  useEffect(() => {
    if (typeof document === 'undefined') return undefined

    const root = document.documentElement
    const sync = () => {
      if (document.hidden) root.setAttribute('data-anim-paused', '')
      else root.removeAttribute('data-anim-paused')
    }

    sync()
    document.addEventListener('visibilitychange', sync)
    return () => {
      document.removeEventListener('visibilitychange', sync)
      root.removeAttribute('data-anim-paused')
    }
  }, [])
}

export default useDocumentHidden
