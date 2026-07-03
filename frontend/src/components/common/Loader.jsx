import { Loader2 } from 'lucide-react'

/**
 * Reusable loading indicator. `size` in px, `label` optional caption.
 */
export default function Loader({ size = 24, label, fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className="animate-spin text-primary-600" size={size} />
      {label && <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
        {content}
      </div>
    )
  }

  return content
}
