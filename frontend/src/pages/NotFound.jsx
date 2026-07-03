import { Link } from 'react-router-dom'
import { Radar, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 dark:bg-gray-950 px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600 text-white">
        <Radar size={28} />
      </div>
      <h1 className="text-6xl font-extrabold text-gray-900 dark:text-white">404</h1>
      <p className="text-gray-500 dark:text-gray-400">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary">
        <Home size={16} /> Back to Home
      </Link>
    </div>
  )
}
