const VARIANTS = {
  low: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  critical: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  pending: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  pothole: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  flood: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
  image: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  video: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
}

export default function Badge({ children, variant = 'pending' }) {
  return (
    <span className={`badge ${VARIANTS[variant] || VARIANTS.pending}`}>
      {children}
    </span>
  )
}
