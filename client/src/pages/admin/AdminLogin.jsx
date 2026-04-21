import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FaGripfire, FaEye, FaEyeSlash } from 'react-icons/fa'
import toast from 'react-hot-toast'
import api from '../../utils/api'
import videoBg from '../../assets/bg.mp4'

const AdminLogin = () => {
  const [searchParams] = useSearchParams();
  const [accessGranted, setAccessGranted] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const secretKey = searchParams.get('key')

  // Verify secret key on mount
  useEffect(() => {
    const verifyKey = async () => {
      if (!secretKey) {
        navigate('/');
        return
      }
      try {
        const response =  await fetch('/auth/verify-access', {
          headers: { 'x-admin-key': secretKey }
        });

        if (response.ok) {
          setAccessGranted(true);
        } else {
          navigate('/');
        }

      } catch {
        navigate('/');
      } finally {
        setVerifying(false);
      }
    }
    verifyKey();
  }, [secretKey, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // clear previous errors
    setLoading(true);
    try {
      const res = await api.post('/auth/login',
        { email: formData.email, password: formData.password },
        { headers: { 'x-admin-key': secretKey } }
      )
      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('adminInfo', JSON.stringify(res.data.admin));
      toast.success(`Welcome back, ${res.data.admin.name}!`);
      navigate('/admin/dashboard');

    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.'
      toast.error(message);
      setError(message);
      
    } finally {
      setLoading(false);
    }
  }

  if (verifying || !accessGranted) return null

  return (
    <div className="h-screen flex items-center justify-center relative">

      {/* Video Background */}
      <div className="fixed inset-0 -z-10">
        <video src={videoBg} autoPlay loop muted playsInline
          className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      </div>

      <div className="w-full max-w-md px-4 md:px-6">
        {/* Logo */}
        <div className="text-center mb-8">
          <FaGripfire className="text-blue-400 text-5xl mx-auto mb-3" />
          <h1 className="text-white font-black font-['Montserrat'] text-2xl tracking-widest uppercase">
            Silver Path
          </h1>
          <p className="text-white/40 text-xs uppercase tracking-widest mt-1">
            Admin Panel
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-white font-bold text-lg mb-6 uppercase tracking-wider">
            Sign In
          </h2>

          {/* Inline error message */}
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-400/20 rounded-xl">
              <p className="text-red-300 text-xs font-medium">
                ⚠️ {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor='email' className="text-white/60 text-xs uppercase tracking-widest mb-2 block">
                Email
              </label>
              <input
                id='email'
                type="email"
                autoComplete='email'
                placeholder="admin@silverpath.com"
                className={`w-full bg-white/10 border rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 outline-none transition-all ${
                  error
                    ? 'border-red-400/50 focus:border-red-400'
                    : 'border-white/20 focus:border-blue-400/50 focus:bg-white/15'
                }`}
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value })
                  setError('') // clear error when user types
                }}
                required
              />
            </div>

            <div>
              <label htmlFor='password' className="text-white/60 text-xs uppercase tracking-widest mb-2 block">
                Password
              </label>
              <div className="relative">
                <input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete='current-password'
                  className={`w-full bg-white/10 border rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 outline-none transition-all pr-12 ${
                    error
                      ? 'border-red-400/50 focus:border-red-400'
                      : 'border-white/20 focus:border-blue-400/50 focus:bg-white/15'
                  }`}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value })
                    setError('') // clear error when user types
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-lg border border-white/20 text-white font-black uppercase tracking-widest py-3 rounded-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin