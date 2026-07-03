import { useState } from 'react'
import { Download, Trash2, Eye, X, Loader2 } from 'lucide-react'
import Badge from '../common/Badge'
import { resolveMediaUrl } from '../../services/api'

export default function SavedResultCard({ detection, onDelete }) {
  const [preview, setPreview] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm('Delete this saved detection permanently?')) return
    setDeleting(true)
    try {
      await onDelete(detection.id)
    } finally {
      setDeleting(false)
    }
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = resolveMediaUrl(detection.detected_file_url)
    link.download = `civiclens-${detection.detection_type}-${detection.id}.${detection.media_type === 'image' ? 'jpg' : 'mp4'}`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  return (
    <>
      <div className="card card-hover overflow-hidden animate-fade-in">
        <div className="relative aspect-video bg-gray-100 dark:bg-gray-800">
          {detection.media_type === 'image' ? (
            <img src={resolveMediaUrl(detection.detected_file_url)} alt={detection.detection_type} className="h-full w-full object-cover" />
          ) : (
            <video src={resolveMediaUrl(detection.detected_file_url)} className="h-full w-full object-cover" />
          )}
          <button
            onClick={() => setPreview(true)}
            className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition-all hover:bg-black/40 hover:opacity-100"
          >
            <Eye size={24} />
          </button>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={detection.detection_type}>{detection.detection_type}</Badge>
            <Badge variant={detection.media_type}>{detection.media_type}</Badge>
          </div>
          <p className="mt-2 text-xs text-gray-400">{new Date(detection.timestamp).toLocaleString()}</p>
          <p className="mt-1 text-sm font-medium text-gray-600 dark:text-gray-300">
            {detection.total_objects_detected} object(s) detected
          </p>
          <div className="mt-4 flex gap-2">
            <button onClick={handleDownload} className="btn-secondary flex-1 !py-1.5 text-xs">
              <Download size={13} /> Download
            </button>
            <button onClick={handleDelete} disabled={deleting} className="flex items-center justify-center rounded-xl border border-red-200 dark:border-red-900 px-3 py-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
              {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            </button>
          </div>
        </div>
      </div>

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 animate-fade-in" onClick={() => setPreview(false)}>
          <button className="absolute right-6 top-6 text-white" onClick={() => setPreview(false)}>
            <X size={28} />
          </button>
          <div className="max-h-[85vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            {detection.media_type === 'image' ? (
              <img src={resolveMediaUrl(detection.detected_file_url)} alt="Preview" className="max-h-[85vh] rounded-xl object-contain" />
            ) : (
              <video src={resolveMediaUrl(detection.detected_file_url)} controls autoPlay className="max-h-[85vh] rounded-xl" />
            )}
          </div>
        </div>
      )}
    </>
  )
}
