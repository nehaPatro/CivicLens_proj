import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react'
import AuthLayout from '../layouts/AuthLayout'
import GoogleAuthButton from '../components/common/GoogleAuthButton'
import { useAuth } from '../hooks/useAuth'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      await signup(form.name, form.email, form.password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err?.response?.data?.detail || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Start monitoring smart city infrastructure with AI">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-xl bg-red-50 dark:bg-red-900/30 px-4 py-3 text-sm text-red-600 dark:text-red-300">
            {error}
          </div>
        )}

        <div>
          <label className="label-text" htmlFor="name">Full name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              id="name" name="name" type="text" required placeholder="Jane Doe"
              value={form.name} onChange={handleChange} className="input-field pl-10"
            />
          </div>
        </div>

        <div>
          <label className="label-text" htmlFor="email">Email address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              id="email" name="email" type="email" required autoComplete="email"
              placeholder="you@example.com" value={form.email} onChange={handleChange}
              className="input-field pl-10"
            />
          </div>
        </div>

        <div>
          <label className="label-text" htmlFor="password">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              id="password" name="password" type={showPassword ? 'text' : 'password'} required
              autoComplete="new-password" placeholder="At least 6 characters"
              value={form.password} onChange={handleChange} className="input-field pl-10 pr-10"
            />
            <button
              type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className="label-text" htmlFor="confirmPassword">Confirm password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              id="confirmPassword" name="confirmPassword" type={showPassword ? 'text' : 'password'} required
              placeholder="Re-enter your password" value={form.confirmPassword} onChange={handleChange}
              className="input-field pl-10"
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Creating account...' : (<><UserPlus size={16} /> Create account</>)}
        </button>

        <div className="relative py-2 text-center">
          <span className="relative bg-white dark:bg-gray-950 px-3 text-xs uppercase text-gray-400">
            Or continue with
          </span>
          <div className="absolute left-0 top-1/2 -z-10 h-px w-full bg-gray-200 dark:bg-gray-800" />
        </div>

        <GoogleAuthButton />

        <p className="pt-2 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary-600 hover:underline">Login</Link>
        </p>
      </form>
    </AuthLayout>
  )
}
