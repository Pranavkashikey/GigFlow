import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../../components/common/LoadingSpinner'

import { toast } from 'react-toastify'

const CreateGig = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'budget' ? parseInt(value) || '' : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('http://localhost:5000/api/gigs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success(' Gig posted successfully!')
        navigate('/')
      } else if (response.status === 401) {
        toast.error('⚠️ Please login first')
        navigate('/login')
      } else {
        const errorData = await response.json()
        alert('❌ Failed: ' + (errorData.message || 'Try again'))
      }
    } catch (error) {
      alert('❌ Network error. Check backend.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-2xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-14 animate-fade-in">
          <h1 className="text-5xl font-black bg-gradient-to-r from-purple-400 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent mb-4">
            Post New Gig
          </h1>
          <p className="text-xl text-gray-400 max-w-lg mx-auto">
            Describe your project and set your budget. Freelancers will bid within minutes.
          </p>
        </div>

        {/* FORM CARD */}
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.7)] p-10 border border-purple-500/20 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* TITLE */}
            <div>
              <label className="block text-lg font-semibold text-gray-300 mb-3">
                Gig Title *
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Build modern React dashboard with Tailwind CSS"
                value={formData.title}
                onChange={handleChange}
                required
                className="
                  w-full px-6 py-5 text-lg
                  bg-black/40 text-white placeholder-gray-500
                  border border-white/10 rounded-3xl
                  focus:outline-none focus:ring-2 focus:ring-purple-500
                  transition-all
                "
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-lg font-semibold text-gray-300 mb-3">
                Project Description *
              </label>
              <textarea
                name="description"
                rows="7"
                placeholder="Tell freelancers exactly what you need..."
                value={formData.description}
                onChange={handleChange}
                required
                className="
                  w-full px-6 py-5 text-lg
                  bg-black/40 text-white placeholder-gray-500
                  border border-white/10 rounded-3xl
                  resize-none
                  focus:outline-none focus:ring-2 focus:ring-purple-500
                  transition-all
                "
              />
            </div>

            {/* BUDGET */}
            <div>
              <label className="block text-lg font-semibold text-gray-300 mb-3">
                Budget (USD) *
              </label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-bold text-purple-400">
                  $
                </span>
                <input
                  type="number"
                  name="budget"
                  min="10"
                  max="50000"
                  placeholder="500"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                  className="
                    w-full pl-12 pr-6 py-5 text-lg
                    bg-black/40 text-white placeholder-gray-500
                    border border-white/10 rounded-3xl
                    focus:outline-none focus:ring-2 focus:ring-green-500
                    transition-all
                  "
                />
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="
                  flex-1 py-5 rounded-3xl
                  bg-white/10 text-gray-300 font-bold text-lg
                  hover:bg-white/20 transition-all
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !formData.title || !formData.description || !formData.budget}
                className="
                  flex-1 py-5 rounded-3xl
                  bg-gradient-to-r from-purple-600 to-fuchsia-600
                  text-white font-bold text-lg
                  hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(168,85,247,0.7)]
                  transition-all disabled:opacity-50
                  flex items-center justify-center gap-3
                "
              >
                {isSubmitting ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Posting Gig...</span>
                  </>
                ) : (
                  <>
                    <span>🚀 Post Gig</span>
                    <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                      Live
                    </span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateGig
