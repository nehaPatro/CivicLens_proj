import { GoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useState } from 'react'

export default function GoogleAuthButton() {
  const { loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const handleSuccess = async (credentialResponse) => {
    setError('')
    try {
      await loginWithGoogle(credentialResponse.credential)
      navigate('/dashboard')
    } catch (err) {
      setError(err?.response?.data?.detail || 'Google sign-in failed. Please try again.')
    }
  }

  return (
    <div className="w-full">
      <div className="flex justify-center [&>div]:!w-full">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => setError('Google sign-in failed. Please try again.')}
          shape="pill"
          theme="outline"
          width="100%"
        />
      </div>
      {error && <p className="mt-2 text-center text-sm text-red-500">{error}</p>}
    </div>
  )
}
