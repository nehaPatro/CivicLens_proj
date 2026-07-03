import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bookmark, FileWarning, Construction, Waves, ScanSearch, ArrowRight,
} from 'lucide-react'
import StatCard from '../../components/dashboard/StatCard'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import Badge from '../../components/common/Badge'
import { useAuth } from '../../hooks/useAuth'
import * as detectionService from '../../services/detectionService'
import { resolveMediaUrl } from '../../services/api'

export default function Dashboard() {
  const { user } = useAuth()
  const [detections, setDetections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await detectionService.getSavedDetections()
        setDetections(data)
      } catch {
        // silently ignore — empty state will show
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const potholeCount = detections.filter((d) => d.detection_type === 'pothole').length
  const floodCount = detections.filter((d) => d.detection_type === 'flood').length
  const recent = detections.slice(0, 5)

  return (
    <div className="space-y-8">
      <div className="animate-fade-in">
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
          Welcome back, {user?.name?.split(' ')[0] || 'there'} 👋
        </h2>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Here's an overview of your smart city monitoring activity.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Bookmark} label="Total Detections" value={user?.total_detections ?? detections.length} accent="primary" />
        <StatCard icon={FileWarning} label="Total Reports" value={user?.total_reports ?? 0} accent="green" />
        <StatCard icon={Construction} label="Pothole Detections" value={potholeCount} accent="orange" />
        <StatCard icon={Waves} label="Flood Detections" value={floodCount} accent="cyan" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Link to="/dashboard/detect" className="card card-hover group flex flex-col justify-between p-6">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
            <ScanSearch size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Run New Detection</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Upload an image or video for AI analysis.</p>
          </div>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-600">
            Go to Detect Issues <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </span>
        </Link>

        <Link to="/dashboard/report" className="card card-hover group flex flex-col justify-between p-6">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400">
            <FileWarning size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Report an Issue</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Submit a saved detection as an official report.</p>
          </div>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-600">
            Go to Report Issue <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </span>
        </Link>

        <Link to="/dashboard/saved" className="card card-hover group flex flex-col justify-between p-6">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400">
            <Bookmark size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">View Saved Results</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Browse, download or delete saved detections.</p>
          </div>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-600">
            Go to Saved Results <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Recent Detections</h3>
        {loading ? (
          <div className="card flex justify-center py-14"><Loader label="Loading recent activity..." /></div>
        ) : recent.length === 0 ? (
          <EmptyState
            icon={ScanSearch}
            title="No detections yet"
            description="Run your first AI detection to see it appear here."
            action={<Link to="/dashboard/detect" className="btn-primary">Detect Issues</Link>}
          />
        ) : (
          <div className="card divide-y divide-gray-100 dark:divide-gray-800">
            {recent.map((d) => (
              <div key={d.id} className="flex items-center gap-4 p-4">
                <img
                  src={resolveMediaUrl(d.detected_file_url)}
                  alt={d.detection_type}
                  className="h-14 w-14 rounded-lg object-cover bg-gray-100 dark:bg-gray-800"
                />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={d.detection_type}>{d.detection_type}</Badge>
                    <Badge variant={d.media_type}>{d.media_type}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-gray-400">{new Date(d.timestamp).toLocaleString()}</p>
                </div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {d.total_objects_detected} objects
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
