/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        hud: {
          void: '#05070A', panel: '#0B1016', panel2: '#121A23', line: '#1C2A36',
          cyan: '#00E5D4', amber: '#FFB020', green: '#36E27B', red: '#FF4D5E',
          // text ramp folded into the same group: text-hud-hi / -mid / -dim
          hi: '#E6F1F5', mid: '#9FB3BF', dim: '#5E7482',
        },
      },
      fontFamily: {
        // mono = labels, telemetry, numbers, nav; sans = body/headings prose
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        sans: ['"Space Grotesk"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hud-xs': ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.12em' }], // 11px telemetry labels
        'hud-sm': ['0.8125rem', { lineHeight: '1.25rem', letterSpacing: '0.06em' }],
      },
      boxShadow: {
        // cyanSoft/amberSoft kept as raw hex here, not as color tokens
        glow: '0 0 0 1px rgba(0,229,212,0.25), 0 0 20px -4px rgba(0,229,212,0.45)',
        'glow-amber': '0 0 0 1px rgba(255,176,32,0.25), 0 0 18px -4px rgba(255,176,32,0.4)',
      },
      backgroundImage: {
        'grid-fine': 'linear-gradient(to right, #1C2A3640 1px, transparent 1px), linear-gradient(to bottom, #1C2A3640 1px, transparent 1px)',
        'scanlines': 'repeating-linear-gradient(0deg, rgba(0,229,212,0.04) 0px, rgba(0,229,212,0.04) 1px, transparent 1px, transparent 3px)',
        'radial-fade': 'radial-gradient(ellipse at 50% 0%, rgba(0,229,212,0.08), transparent 60%)',
      },
      backgroundSize: { 'grid-fine': '40px 40px' },
      keyframes: {
        scanline: { '0%': { transform: 'translateY(-100%)' }, '100%': { transform: 'translateY(100%)' } },
        'radar-sweep': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } },
        'glow-pulse': { '0%,100%': { opacity: '0.55' }, '50%': { opacity: '1' } },
        // Composite-friendly: translate an oversized grid layer by exactly one
        // 40px cell so it loops seamlessly on the GPU instead of repainting the
        // background-position every frame. Visually identical to the old drift.
        'grid-drift': { '0%': { transform: 'translate3d(0, 0, 0)' }, '100%': { transform: 'translate3d(40px, 40px, 0)' } },
        flicker: { '0%,19%,21%,80%,82%,100%': { opacity: '1' }, '20%,81%': { opacity: '0.7' } },
        'blink': { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.2' } },
      },
      animation: {
        scanline: 'scanline 6s linear infinite',
        'radar-sweep': 'radar-sweep 4s linear infinite',
        'glow-pulse': 'glow-pulse 2.4s ease-in-out infinite',
        'grid-drift': 'grid-drift 3s linear infinite',
        flicker: 'flicker 4s linear infinite',
        blink: 'blink 1.2s step-end infinite',
      },
    },
  },
  plugins: [],
}
