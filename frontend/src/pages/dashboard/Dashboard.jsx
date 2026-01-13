import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import GigCard from '../../components/gigs/GigCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
const Dashboard = () => {
  const [myGigs, setMyGigs] = useState([])
  const [myBids, setMyBids] = useState([])
  const [hiredProjects, setHiredProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [bidsLoading, setBidsLoading] = useState(false)
  const [hiredLoading, setHiredLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('my-gigs')
  const navigate = useNavigate()

  // 🔥 LIVE COUNTS
  const tabs = [
    { id: 'my-gigs', label: 'My Gigs', count: myGigs.length },
    { id: 'my-bids', label: 'My Bids', count: myBids.length },
    { id: 'hired', label: 'Hired Projects', count: hiredProjects.length }
  ]

  // FETCH MY GIGS (Owner)
  const fetchMyGigs = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/gigs/my-gigs', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setMyGigs(data.data || [])
      }
    } catch (error) {
      console.error('Gigs error:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // FETCH MY BIDS (Freelancer)
  const fetchMyBids = useCallback(async () => {
    try {
      setBidsLoading(true)
      const response = await fetch('http://localhost:5000/api/bids/my-bids', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setMyBids(data.data || [])
      }
    } catch (error) {
      console.error('Bids error:', error)
    } finally {
      setBidsLoading(false)
    }
  }, [])

  // 🔥 FETCH HIRED PROJECTS (NEW ROUTE)
  const fetchHiredProjects = useCallback(async () => {
    try {
      setHiredLoading(true)
      const response = await fetch('http://localhost:5000/api/gigs/hired-projects', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setHiredProjects(data.data || [])
      }
    } catch (error) {
      console.error('Hired projects error:', error)
    } finally {
      setHiredLoading(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    fetchMyGigs()
  }, [fetchMyGigs])

  // Tab switch auto-load
  useEffect(() => {
    if (activeTab === 'my-bids') fetchMyBids()
    else if (activeTab === 'hired') fetchHiredProjects()
  }, [activeTab, fetchMyBids, fetchHiredProjects])

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />
  }

  return (
  <div className="min-h-screen px-4 py-12 bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-gray-100 transition-all duration-500">
    <div className="max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="text-center mb-20 animate-fade-in">
        <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6">
          Dashboard
        </h1>
        <p className="text-xl text-gray-400">
          Total items: {tabs.reduce((sum, tab) => sum + tab.count, 0)}
        </p>
      </div>

      {/* POST GIG */}
      <div className="text-center mb-20">
        <button
          onClick={() => navigate('/create-gig')}
          className="group relative px-12 py-6 rounded-3xl font-bold text-xl text-white bg-gradient-to-r from-emerald-500 to-green-600 shadow-2xl hover:scale-105 transition-all"
        >
          <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 rounded-3xl transition" />
          🚀 Post New Gig
        </button>
      </div>

      {/* TABS CONTAINER */}
      <div className="bg-white/5 backdrop-blur-2xl rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden">

        {/* TAB HEADERS */}
        <div className="border-b border-white/10">
          <nav className="flex px-6 py-6 gap-3">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 rounded-2xl font-bold text-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl scale-105'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.label}
                <span className="ml-2 text-sm px-3 py-1 rounded-full bg-black/30">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* MY GIGS */}
        {activeTab === 'my-gigs' && (
          <div className="p-10 animate-slide-up">
            {myGigs.length === 0 ? (
              <EmptyState
                icon="📭"
                title="No gigs posted"
                action={() => navigate('/create-gig')}
                actionText="Post First Gig"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {myGigs.map(gig => (
                  <GigCard key={gig._id} gig={gig} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* MY BIDS */}
        {activeTab === 'my-bids' && (
          <div className="p-10 animate-slide-up">
            {myBids.length === 0 ? (
              <EmptyState
                icon="📋"
                title="No bids placed"
                action={() => navigate('/')}
                actionText="Browse Gigs"
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {myBids.map(bid => (
                  <div
                    key={bid._id}
                    className="bg-gradient-to-br from-[#1e293b] to-[#020617] rounded-3xl p-8 border border-white/10 hover:scale-[1.02] hover:shadow-2xl transition-all"
                  >
                    <h4 className="text-2xl font-bold text-cyan-400 mb-2">
                      {bid.gigId?.title}
                    </h4>
                    <p className="text-gray-300 line-clamp-3 mb-4">
                      {bid.message}
                    </p>

                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-emerald-400">
                        ${bid.price}
                      </span>
                      <span className={`px-4 py-2 rounded-xl text-sm font-bold ${
                        bid.status === 'hired'
                          ? 'bg-green-500/20 text-green-400'
                          : bid.status === 'rejected'
                          ? 'bg-gray-500/20 text-gray-300'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {bid.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="mt-4 text-sm text-gray-400">
                      Owner: {bid.gigId?.ownerId?.name || 'Unknown'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* HIRED */}
        {activeTab === 'hired' && (
          <div className="p-10 animate-slide-up">
            {hiredProjects.length === 0 ? (
              <EmptyState
                icon="✅"
                title="No hired projects yet"
                action={() => navigate('/')}
                actionText="Find Gigs"
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {hiredProjects.map(project => (
                  <div
                    key={project._id}
                    className="bg-gradient-to-br from-emerald-900/40 to-black rounded-3xl p-8 border border-emerald-500/20 hover:scale-[1.02] transition-all"
                  >
                    <h4 className="text-2xl font-bold text-emerald-400 mb-4">
                      {project.title}
                    </h4>
                    <p className="text-gray-300 mb-6">
                      {project.description}
                    </p>
                    <div className="flex justify-between">
                      <span className="text-3xl font-bold text-white">
                        ${project.budget}
                      </span>
                      <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-xl font-bold">
                        ACTIVE
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  </div>
)

}

export default Dashboard
