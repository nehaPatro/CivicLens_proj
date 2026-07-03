import { useState } from 'react'
import * as detectionService from '../services/detectionService'

/**
 * Encapsulates the upload -> detect -> save workflow shared by all
 * four detection cards (pothole/flood, image/video).
 */
export function useDetection(detectionType, mediaType) {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [result, setResult] = useState(null)
  const [isDetecting, setIsDetecting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const selectFile = (selectedFile) => {
    setFile(selectedFile)
    setResult(null)
    setSaved(false)
    setError('')
    setPreviewUrl(selectedFile ? URL.createObjectURL(selectedFile) : null)
  }

  const runDetection = async () => {
    if (!file) return
    setIsDetecting(true)
    setError('')
    try {
      const data = await detectionService.detect(detectionType, mediaType, file)
      setResult(data)
    } catch (err) {
      setError(err?.response?.data?.detail || 'Detection failed. Please try again.')
    } finally {
      setIsDetecting(false)
    }
  }

  const saveResult = async () => {
    if (!result) return
    setIsSaving(true)
    setError('')
    try {
      await detectionService.saveDetection({
        detection_type: result.detection_type,
        media_type: result.media_type,
        original_file_url: result.original_file_url,
        detected_file_url: result.detected_file_url,
        total_objects_detected: result.total_objects_detected,
      })
      setSaved(true)
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to save result.')
    } finally {
      setIsSaving(false)
    }
  }

  const reset = () => {
    setFile(null)
    setPreviewUrl(null)
    setResult(null)
    setSaved(false)
    setError('')
  }

  return {
    file, previewUrl, result, isDetecting, isSaving, saved, error,
    selectFile, runDetection, saveResult, reset,
  }
}
