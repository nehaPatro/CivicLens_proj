import { useEffect, useState } from 'react'
import { MapPin, AlignLeft, AlertTriangle, Send, CheckCircle2 } from 'lucide-react'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import Badge from '../../components/common/Badge'
import * as detectionService from '../../services/detectionService'
import * as reportService from '../../services/reportService'
import { resolveMediaUrl } from '../../services/api'
import { Link } from 'react-router-dom'
import { FileWarning } from 'lucide-react'

const SEVERITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
]

export default function ReportIssue() {
  const [detections, setDetections] = useState([])
  const [loadingDetections, setLoadingDetections] = useState(true)
  const [selectedId, setSelectedId] = useState('')
  const [form, setForm] = useState({ location: '', description: '', severity: 'medium' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const data = await detectionService.getSavedDetections()
        setDetections(data)
      } catch {
        setError('Failed to load saved detections.')
      } finally {
        setLoadingDetections(false)
      }
    }
    load()
  }, [])

  const selected = detections.find((d) => d.id === selectedId)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedId) {
      setError('Please select a saved detection first.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      await reportService.createReport({
        detection_id: selectedId,
        location: form.location,
        description: form.description,
        severity: form.severity,
      })
      setSuccess(true)
      setForm({ location: '', description: '', severity: 'medium' })
      setSelectedId('')
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to submit report.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingDetections) {
    return <div className="card flex justify-center py-16"><Loader label="Loading saved detections..." /></div>
  }

  if (detections.length === 0) {
    return (
      <EmptyState
        icon={FileWarning}
        title="No saved detections to report"
        description="Save a detection result first, then come back here to file a report."
        action={<Link to="/dashboard/detect" className="btn-primary">Detect Issues</Link>}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Report Issue</h2>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Select a saved detection, add details, and submit an official issue report.
        </p>
      </div>

      {success && (
        <div className="flex items-center gap-2 rounded-xl bg-green-50 dark:bg-green-900/30 px-4 py-3 text-sm font-medium text-green-700 dark:text-green-300 animate-fade-in">
          <CheckCircle2 size={18} /> Report submitted successfully!
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Selection list */}
        <div className="lg:col-span-2">
          <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">1. Select a saved detection</h3>
          <div className="grid max-h-[520px] grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3 lg:grid-cols-2">
            {detections.map((d) => (
              <button
                type="button"
                key={d.id}
                onClick={() => setSelectedId(d.id)}
                className={`overflow-hidden rounded-xl border-2 text-left transition-all ${
                  selectedId === d.id ? 'border-primary-600 ring-2 ring-primary-200 dark:ring-primary-900' : 'border-transparent'
                }`}
              >
                <div className="aspect-video bg-gray-100 dark:bg-gray-800">
                  {d.media_type === 'image' ? (
                    <img src={resolveMediaUrl(d.detected_file_url)} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <video src={resolveMediaUrl(d.detected_file_url)} className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="p-2">
                  <Badge variant={d.detection_type}>{d.detection_type}</Badge>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Report form */}
        <div className="lg:col-span-3">
          <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">2. Fill in report details</h3>
          <form onSubmit={handleSubmit} className="card space-y-4 p-6">
            {error && (
              <div className="rounded-xl bg-red-50 dark:bg-red-900/30 px-4 py-3 text-sm text-red-600 dark:text-red-300">{error}</div>
            )}

            {selected ? (
              <div className="flex items-center gap-4 rounded-xl border border-gray-200 dark:border-gray-800 p-3">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                  {selected.media_type === 'image' ? (
                    <img src={resolveMediaUrl(selected.detected_file_url)} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <video src={resolveMediaUrl(selected.detected_file_url)} className="h-full w-full object-cover" />
                  )}
                </div>
                <div>
                  <div className="flex gap-2">
                    <Badge variant={selected.detection_type}>{selected.detection_type}</Badge>
                    <Badge variant={selected.media_type}>{selected.media_type}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-gray-400">{new Date(selected.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400">No detection selected yet.</p>
            )}

            <div>
              <label className="label-text" htmlFor="location">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  id="location" required placeholder="e.g. MG Road, near City Hospital"
                  value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label className="label-text" htmlFor="description">Description</label>
              <div className="relative">
                <AlignLeft className="absolute left-3 top-3 text-gray-400" size={18} />
                <textarea
                  id="description" required rows={4} placeholder="Describe the issue in detail..."
                  value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="input-field resize-none pl-10"
                />
              </div>
            </div>

            <div>
              <label className="label-text" htmlFor="severity">Severity</label>
              <div className="relative">
                <AlertTriangle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <select
                  id="severity" value={form.severity}
                  onChange={(e) => setForm({ ...form, severity: e.target.value })}
                  className="input-field pl-10"
                >
                  {SEVERITY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Submitting...' : (<><Send size={16} /> Submit Report</>)}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
