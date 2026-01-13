import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import BidForm from '../../components/bids/BidForm'
import BidCard from '../../components/bids/BidCard'

const GigDetails = () => {
  const { gigId } = useParams()
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)
  const [gig, setGig] = useState(null)
  const [bids, setBids] = useState([])
  const [loading, setLoading] = useState(true)
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    fetchGig()
  }, [gigId])

  const fetchGig = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/gigs/${gigId}`, {
        credentials: 'include'
      })
      const data = await res.json()
      setGig(data.data)

      if (user && data.data.ownerId._id === user.id) {
        setIsOwner(true)
        fetchBids()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchBids = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/bids/${gigId}`, {
        credentials: 'include'
      })
      const data = await res.json()
      setBids(data.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  const handleHire = async (bidId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bids/${bidId}/hire`, {
        method: 'PATCH',
        credentials: 'include'
      })
      if (res.ok) {
        fetchGig()
        fetchBids()
      }
    } catch {
      alert('Failed to hire freelancer')
    }
  }

  if (loading) return <LoadingSpinner />

  if (!gig) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center text-white">
        <div>
          <h1 className="text-3xl font-bold mb-4">Gig not found</h1>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-purple-600 rounded-xl font-bold"
          >
            Browse Gigs
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-16 px-4 bg-gradient-to-br from-[#05040a] via-[#0b0618] to-[#120726] text-white">
      <div className="max-w-6xl mx-auto space-y-14">

        {/* GIG HEADER */}
        <div className="relative bg-white/5 backdrop-blur-2xl rounded-3xl p-10 border border-purple-500/20 shadow-2xl">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10" />

          <div className="relative flex flex-col lg:flex-row gap-10 justify-between">
            {/* LEFT */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <span className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide ${
                  gig.status === 'open'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                }`}>
                  {gig.status.toUpperCase()}
                </span>

                {isOwner && (
                  <span className="px-4 py-2 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-xs font-bold">
                    YOUR GIG
                  </span>
                )}
              </div>

              <h1 className="text-5xl font-black mb-6 leading-tight">
                {gig.title}
              </h1>

              <p className="text-gray-300 text-xl leading-relaxed mb-8">
                {gig.description}
              </p>

              <div className="flex items-center gap-10">
                <div className="text-4xl font-extrabold text-emerald-400">
                  ${gig.budget}
                </div>
                <div className="text-gray-400">
                  Posted by{' '}
                  <span className="text-white font-semibold">
                    {gig.ownerId.name}
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT CARD */}
            <div className="w-full lg:w-[320px]">
              <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10 text-center shadow-xl">
                <div className="text-5xl font-black mb-2">
                  {bids.length}
                </div>
                <p className="text-gray-400 mb-6">Bids Received</p>

                {isOwner ? (
                  <button
                    disabled={gig.status !== 'open'}
                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
                      gig.status === 'open'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]'
                        : 'bg-gray-700 cursor-not-allowed'
                    }`}
                  >
                    {gig.status === 'open' ? 'Review Bids' : 'Gig Assigned'}
                  </button>
                ) : (
                  <BidForm gigId={gigId} onBidSubmitted={fetchBids} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* BIDS SECTION */}
        {isOwner && bids.length > 0 && (
          <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-10 border border-purple-500/20 shadow-2xl">
            <h2 className="text-4xl font-black mb-10 flex items-center gap-3">
              Bids ({bids.length})
              <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {bids.map(bid => (
                <BidCard
                  key={bid._id}
                  bid={bid}
                  onHire={handleHire}
                  canHire={gig.status === 'open' && bid.status === 'pending'}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GigDetails
