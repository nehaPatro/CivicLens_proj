import { useState } from 'react'
import { Mail, User, Bookmark, FileWarning, Save, Loader2 } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import * as authService from '../../services/authService'

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const initials = (user?.name || 'U')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setSaving(true)
    try {
      const updated = await authService.updateProfile({ name })
      updateUser(updated)
      setSuccess(true)
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="animate-fade-in">
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Profile</h2>
        <p className="mt-1 text-gray-500 dark:text-gray-400">Manage your account details.</p>
      </div>

      <div className="card p-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          {user?.profile_picture ? (
            <img src={user.profile_picture} alt={user.name} className="h-20 w-20 rounded-2xl object-cover" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-600 text-2xl font-bold text-white">
              {initials}
            </div>
          )}
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h3>
            <p className="flex items-center justify-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 sm:justify-start">
              <Mail size={14} /> {user?.email}
            </p>
            <span className="mt-2 inline-block rounded-full bg-primary-50 dark:bg-primary-900/30 px-3 py-1 text-xs font-semibold text-primary-600 dark:text-primary-400">
              {user?.auth_provider === 'google' ? 'Signed in with Google' : 'Manual Account'}
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 text-center">
            <Bookmark className="mx-auto mb-1 text-primary-600" size={20} />
            <p className="text-xl font-extrabold text-gray-900 dark:text-white">{user?.total_detections ?? 0}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Detections</p>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 text-center">
            <FileWarning className="mx-auto mb-1 text-primary-600" size={20} />
            <p className="text-xl font-extrabold text-gray-900 dark:text-white">{user?.total_reports ?? 0}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Reports</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="card space-y-4 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white">Edit Profile</h3>

        {success && (
          <div className="rounded-xl bg-green-50 dark:bg-green-900/30 px-4 py-3 text-sm text-green-700 dark:text-green-300">
            Profile updated successfully!
          </div>
        )}
        {error && (
          <div className="rounded-xl bg-red-50 dark:bg-red-900/30 px-4 py-3 text-sm text-red-600 dark:text-red-300">{error}</div>
        )}

        <div>
          <label className="label-text" htmlFor="name">Full name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} className="input-field pl-10" />
          </div>
        </div>

        <div>
          <label className="label-text">Email address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input value={user?.email || ''} disabled className="input-field pl-10 opacity-60" />
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? (<><Loader2 size={16} className="animate-spin" /> Saving...</>) : (<><Save size={16} /> Save Changes</>)}
        </button>
      </form>
    </div>
  )
}
