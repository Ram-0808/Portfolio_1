import { Component } from 'react'

// Error boundary around the lazy HeroCanvas. There is no hooks error-boundary
// API, so this is a class component. <Suspense> only catches lazy-load, NOT
// runtime WebGL/R3F throws, so this is required to guarantee the static hero on
// a mid-session WebGL/context failure. On error it renders `this.props.fallback`
// (the StaticHudHero) and logs once; otherwise it renders its children.
export default class CanvasErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch() {
    // Log once for diagnostics; the failure is not fatal to the page, only the
    // hero subtree degrades to the static fallback.
    // eslint-disable-next-line no-console
    console.warn('[HeroCanvas] WebGL render failed, showing static hero')
  }

  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}
