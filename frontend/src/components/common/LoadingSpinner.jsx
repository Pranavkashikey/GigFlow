const LoadingSpinner = ({ message = "Loading gigs..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
      <p className="text-lg text-gray-600">{message}</p>
    </div>
  )
}

export default LoadingSpinner
