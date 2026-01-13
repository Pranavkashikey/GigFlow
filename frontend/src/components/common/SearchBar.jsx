import { useState, useEffect } from 'react'

const SearchBar = ({ 
  onSearchChange, 
  totalResults, 
  placeholder = "🔍 Search gigs by title, description..." 
}) => {
  const [searchTerm, setSearchTerm] = useState('')

  // Debounce - 300ms delay
useEffect(() => {
  const timer = setTimeout(() => {
    onSearchChange(searchTerm);
  }, 300);

  return () => clearTimeout(timer);
}, [searchTerm, onSearchChange]);

  return (
    <div className="relative">
      <input 
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full px-6 py-4 pl-14 pr-16 text-lg border-2 border-gray-200 text-gray-800 rounded-3xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 shadow-xl transition-all duration-300"
      />
      <svg className="w-6 h-6 text-gray-400 absolute left-5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} stroke="currentColor" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-100 text-blue-800 px-3 py-1 rounded-2xl text-sm font-bold">
        {totalResults}
      </span>
      
    </div>
  )
}

export default SearchBar
