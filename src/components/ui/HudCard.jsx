import CornerBrackets from './CornerBrackets'

// Glass card with corner brackets. Used by Skills / Missions.
export default function HudCard({ children, className = '', ...rest }) {
  return (
    <div className={`glass relative rounded-sm p-5 ${className}`} {...rest}>
      <CornerBrackets size={12} />
      {children}
    </div>
  )
}
