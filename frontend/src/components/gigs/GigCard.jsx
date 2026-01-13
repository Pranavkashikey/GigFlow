import { Link } from 'react-router-dom'
import { Eye, DollarSign, User } from 'lucide-react'

const GigCard = ({ gig }) => {
  return (
    <Link to={`/gigs/${gig._id}`} className="group">
      <div
        className="
          relative h-full
          bg-white/5 backdrop-blur-2xl
          border border-purple-500/20
          rounded-3xl overflow-hidden
          transition-all duration-500
          hover:-translate-y-3 hover:scale-[1.02]
          hover:shadow-[0_0_40px_rgba(168,85,247,0.35)]
        "
      >
        {/* subtle glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10" />

        <div className="relative p-8 flex flex-col h-full">

          {/* HEADER */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-lg">
                <DollarSign className="w-7 h-7 text-white" />
              </div>

              <div>
                <h3 className="text-xl font-black text-white leading-snug line-clamp-2 group-hover:text-purple-400 transition-colors">
                  {gig.title}
                </h3>
                <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                  <User className="w-4 h-4" />
                  by {gig.ownerId?.name || 'Client'}
                </p>
              </div>
            </div>

            <span
              className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide ${
                gig.status === 'open'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
              }`}
            >
              {gig.status.toUpperCase()}
            </span>
          </div>

          {/* DESCRIPTION */}
          <p className="text-gray-300 leading-relaxed line-clamp-3 mb-6">
            {gig.description}
          </p>

          {/* FOOTER */}
          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1 font-bold text-purple-400">
                {/* <DollarSign className="w-4 h-4" /> */}
                Price: ${gig.budget}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {new Date(gig.createdAt).toLocaleDateString()}
              </span>
            </div>

            <span
              className="
                px-6 py-2 rounded-xl
                bg-gradient-to-r from-purple-600 to-fuchsia-600
                text-white font-bold text-sm
                shadow-lg
                group-hover:shadow-[0_0_20px_rgba(168,85,247,0.7)]
                transition-all
              "
            >
              View Details
            </span>
          </div>

        </div>
      </div>
    </Link>
  )
}

export default GigCard
