import { useEffect, useState } from 'react'
import { Bookmark } from 'lucide-react'
import { Link } from 'react-router-dom'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import SavedResultCard from '../../components/dashboard/SavedResultCard'
import * as detectionService from '../../services/detectionService'

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pothole', label: 'Pothole' },
  { key: 'flood', label: 'Flood' },
  { key: 'image', label: 'Image' },
  { key: 'video', label: 'Video' },
]

export default function SavedResults() {
  const [detections, setDetections] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [error, setError] = useState('')

  const fetchDetections = async () => {
    setLoading(true)
    try {
      const data = await detectionService.getSavedDetections()
      setDetections(data)
    } catch {
      setError('Failed to load saved results.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDetections() }, [])

  const handleDelete = async (id) => {
    await detectionService.deleteDetection(id)
    setDetections((prev) => prev.filter((d) => d.id !== id))
  }

  const filtered = detections.filter((d) => {
    if (filter === 'all') return true
    return d.detection_type === filter || d.media_type === filter
  })

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Saved Results</h2>
        <p className="mt-1 text-gray-500 dark:text-gray-400">View, download, or delete your saved detections.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              filter === f.key
                ? 'bg-primary-600 text-white'
                : 'border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="card flex justify-center py-16"><Loader label="Loading your saved results..." /></div>
      ) : error ? (
        <div className="card p-6 text-center text-red-500">{error}</div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved results found"
          description="Run a detection and click Save to see it appear here."
          action={<Link to="/dashboard/detect" className="btn-primary">Detect Issues</Link>}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => (
            <SavedResultCard key={d.id} detection={d} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
