import api from './api'

export async function signup(name, email, password) {
  const { data } = await api.post('/api/auth/signup', { name, email, password })
  return data
}

export async function login(email, password) {
  const { data } = await api.post('/api/auth/login', { email, password })
  return data
}

export async function googleLogin(idToken) {
  const { data } = await api.post('/api/auth/google', { id_token: idToken })
  return data
}

export async function getProfile() {
  const { data } = await api.get('/api/profile/me')
  return data
}

export async function updateProfile(payload) {
  const { data } = await api.put('/api/profile/me', payload)
  return data
}
