import api from './api'

/**
 * Run YOLO detection on an uploaded file.
 * @param {'pothole'|'flood'} detectionType
 * @param {'image'|'video'} mediaType
 * @param {File} file
 */
export async function detect(detectionType, mediaType, file) {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await api.post(`/api/detect/${detectionType}/${mediaType}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function saveDetection(payload) {
  const { data } = await api.post('/api/detect/save', payload)
  return data
}

export async function getSavedDetections() {
  const { data } = await api.get('/api/detect/saved')
  return data
}

export async function deleteDetection(detectionId) {
  await api.delete(`/api/detect/saved/${detectionId}`)
}
