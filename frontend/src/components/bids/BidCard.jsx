const BidCard = ({ bid, onHire, canHire }) => {
  return (
    <div
      className="
        relative
        bg-white/5 backdrop-blur-2xl
        border border-purple-500/20
        rounded-3xl p-8
        transition-all duration-500
        hover:-translate-y-2 hover:scale-[1.01]
        hover:shadow-[0_0_35px_rgba(168,85,247,0.35)]
      "
    >
      {/* glow */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10 rounded-3xl" />

      <div className="relative">
        {/* HEADER */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">${bid.price}</span>
            </div>
            <div>
              <h4 className="font-bold text-xl text-white">
                {bid.freelancerId?.name || 'Freelancer'}
              </h4>
              <p className="text-sm text-gray-400">Freelancer</p>
            </div>
          </div>

          <span
            className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide ${
              bid.status === 'hired'
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : bid.status === 'rejected'
                ? 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
            }`}
          >
            {bid.status.toUpperCase()}
          </span>
        </div>

        {/* MESSAGE */}
        <p className="text-gray-300 leading-relaxed mb-8 line-clamp-4">
          {bid.message}
        </p>

        {/* FOOTER */}
        <div className="flex items-center justify-between pt-6 border-t border-white/10">
          <div className="text-sm text-gray-400">
            {new Date(bid.createdAt).toLocaleDateString()}
          </div>

          {canHire && (
            <button
              onClick={() => onHire(bid._id)}
              className="
                bg-gradient-to-r from-emerald-500 to-green-600
                text-white px-8 py-3 rounded-2xl font-bold
                hover:scale-105 hover:shadow-[0_0_25px_rgba(34,197,94,0.6)]
                transition-all
              "
            >
              Hire Freelancer
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default BidCard
