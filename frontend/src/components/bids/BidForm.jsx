import { useState } from 'react'
import { toast } from 'react-toastify'

const BidForm = ({ gigId, onBidSubmitted }) => {
  const [formData, setFormData] = useState({ message: '', price: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch('http://localhost:5000/api/bids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          gigId,
          ...formData,
          price: parseInt(formData.price)
        })
      })

      if (response.ok) {
        setFormData({ message: '', price: '' })
        onBidSubmitted()
        toast.success('Bid submitted successfully!')
      }
    } catch {
      alert('Failed to submit bid')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-black/40 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-xl"
    >
      {/* PROPOSAL */}
      <div>
        <label className="block text-sm font-bold text-gray-300 mb-3 tracking-wide">
          Your Proposal
        </label>
        <textarea
          rows="5"
          placeholder="Why should the client hire you?
• Relevant experience
• Delivery timeline
• Value you provide
• Questions (if any)"
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          required
          className="w-full px-5 py-4 text-gray-200 bg-black/50 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 resize-none placeholder-gray-500 transition-all"
        />
      </div>

      {/* PRICE */}
      <div>
        <label className="block text-sm font-bold text-gray-300 mb-3 tracking-wide">
          Your Price
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-purple-400">
            $
          </span>
          <input
            type="number"
            min="10"
            placeholder="250"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            required
            className="w-full pl-12 pr-5 py-4 text-gray-200 bg-black/50 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 placeholder-gray-500 transition-all"
          />
        </div>
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-5 rounded-3xl font-extrabold text-lg text-white bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 shadow-[0_0_25px_rgba(236,72,153,0.6)] hover:shadow-[0_0_40px_rgba(236,72,153,0.9)] hover:scale-[1.03] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <span className="flex items-center justify-center gap-3">
            <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Submitting...
          </span>
        ) : (
          '🔥 Submit Bid'
        )}
      </button>
    </form>
  )
}

export default BidForm
