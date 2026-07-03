import { useRef } from 'react'
import { UploadCloud, Download, Save, RefreshCcw, CheckCircle2, Loader2 } from 'lucide-react'
import { useDetection } from '../../hooks/useDetection'
import { resolveMediaUrl } from '../../services/api'

/**
 * Generic detection card used for all four workflows:
 * Pothole/Flood x Image/Video. Handles the full
 * upload -> detect -> preview -> download -> save cycle.
 */
export default function DetectionCard({ title, description, icon: Icon, accent, detectionType, mediaType }) {
  const fileInputRef = useRef(null)
  const {
    file, previewUrl, result, isDetecting, isSaving, saved, error,
    selectFile, runDetection, saveResult, reset,
  } = useDetection(detectionType, mediaType)

  const accentClasses = {
    orange: 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    cyan: 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400',
  }

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    if (selected) selectFile(selected)
  }

  const handleDownload = () => {
    if (!result?.detected_file_url) return
    const link = document.createElement('a')
    link.href = resolveMediaUrl(result.detected_file_url)
    link.download = `civiclens-${detectionType}-${Date.now()}.${mediaType === 'image' ? 'jpg' : 'mp4'}`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  return (
    <div className="card p-6 animate-fade-in">
      <div className="mb-4 flex items-center gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accentClasses[accent]}`}>
          <Icon size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>

      {/* Upload zone */}
      {!previewUrl && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 py-10 text-gray-400 transition-colors hover:border-primary-500 hover:text-primary-600"
        >
          <UploadCloud size={28} />
          <span className="text-sm font-medium">Click to upload {mediaType}</span>
          <span className="text-xs">{mediaType === 'image' ? 'JPG, PNG, WEBP' : 'MP4, MOV, AVI'} up to 50MB</span>
        </button>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept={mediaType === 'image' ? 'image/*' : 'video/*'}
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Preview / result area */}
      {previewUrl && (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
            {result ? (
              mediaType === 'image' ? (
                <img src={resolveMediaUrl(result.detected_file_url)} alt="Detection result" className="w-full object-contain max-h-80" />
              ) : (
                <video src={resolveMediaUrl(result.detected_file_url)} controls className="w-full max-h-80" />
              )
            ) : mediaType === 'image' ? (
              <img src={previewUrl} alt="Preview" className="w-full object-contain max-h-80" />
            ) : (
              <video src={previewUrl} controls className="w-full max-h-80" />
            )}
          </div>

          {result && (
            <div className="flex items-center justify-between rounded-lg bg-primary-50 dark:bg-primary-900/20 px-4 py-2 text-sm">
              <span className="font-medium text-primary-700 dark:text-primary-300">
                {result.total_objects_detected} object(s) detected
              </span>
              {saved && (
                <span className="flex items-center gap-1 font-medium text-green-600 dark:text-green-400">
                  <CheckCircle2 size={14} /> Saved
                </span>
              )}
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/30 px-4 py-2 text-sm text-red-600 dark:text-red-300">
              {error}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {!result ? (
              <button onClick={runDetection} disabled={isDetecting} className="btn-primary flex-1">
                {isDetecting ? (<><Loader2 size={16} className="animate-spin" /> Detecting...</>) : 'Detect'}
              </button>
            ) : (
              <>
                <button onClick={handleDownload} className="btn-secondary flex-1 !py-2 text-sm">
                  <Download size={15} /> Download
                </button>
                <button onClick={saveResult} disabled={isSaving || saved} className="btn-primary flex-1 !py-2 text-sm">
                  {isSaving ? (<><Loader2 size={15} className="animate-spin" /> Saving...</>) : saved ? 'Saved ✓' : (<><Save size={15} /> Save</>)}
                </button>
              </>
            )}
            <button onClick={reset} className="flex items-center justify-center rounded-xl border border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800" title="Reset">
              <RefreshCcw size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
