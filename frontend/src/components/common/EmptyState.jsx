const EmptyState = ({ icon, title, description, action, actionText }) => {
  return (
    <div className="text-center py-24 animate-fade-in">
      <div className="w-28 h-28 mx-auto mb-8 bg-white/5 rounded-3xl flex items-center justify-center shadow-xl">
        <span className="text-5xl">{icon}</span>
      </div>

      <h4 className="text-3xl font-bold text-white mb-4">
        {title}
      </h4>

      {description && (
        <p className="text-lg text-gray-400 mb-8 max-w-md mx-auto">
          {description}
        </p>
      )}

      {action && (
        <button
          onClick={action}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-3xl font-bold text-lg shadow-2xl hover:scale-105 transition-all"
        >
          {actionText}
        </button>
      )}
    </div>
  )
}

export default EmptyState
