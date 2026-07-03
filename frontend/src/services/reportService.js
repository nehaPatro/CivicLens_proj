import api from './api'

export async function createReport(payload) {
  const { data } = await api.post('/api/reports/', payload)
  return data
}

export async function getReports() {
  const { data } = await api.get('/api/reports/')
  return data
}
