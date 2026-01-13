import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../redux/slices/authSlice'
import { LogOut, LayoutDashboard, User } from 'lucide-react'

const Navbar = () => {
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#0b0014] via-[#12001f] to-[#0b0014] backdrop-blur-2xl border-b border-purple-500/20 shadow-[0_10px_40px_rgba(128,0,255,0.25)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center py-4">

          {/* LOGO */}
          <Link
            to="/"
            className="text-3xl font-black bg-gradient-to-r from-purple-400 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent tracking-wide"
          >
            GigFlow
          </Link>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-6">

            {!user ? (
              <>
                <Link
                  to="/login"
                  className="px-6 py-2 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:scale-105 hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] transition-all"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="px-6 py-2 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:scale-105 hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] transition-all"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {/* Dashboard */}
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 text-gray-300 font-semibold hover:text-purple-400 transition-all"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>

                {/* User */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300">
                  <User size={16} />
                  <span className="font-semibold">{user.name}</span>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            )}

          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
