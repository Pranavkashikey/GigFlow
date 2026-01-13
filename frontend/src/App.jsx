import { Provider, useDispatch } from 'react-redux'
import { store } from './redux/store'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'

import Navbar from './components/common/Navbar'
import Home from './pages/gigs/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import CreateGig from './pages/gigs/CreateGig'
import Dashboard from './pages/dashboard/Dashboard'
import GigDetails from './pages/gigs/GigDetails'
import ProtectedRoute from './components/routes/ProtectedRoutes'

import api from './services/api'
import { setUser } from './redux/slices/authSlice'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AppContent = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await api.auth.me()
        dispatch(setUser(res.data.user))
      } catch (err) {
        // user not logged in
      }
    }
    loadUser()
  }, [])

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <Routes>
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
  path="/create-gig"
  element={
    <ProtectedRoute>
      <CreateGig />
    </ProtectedRoute>
  }
/>
            <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
            <Route path="/gigs/:gigId" element={<ProtectedRoute><GigDetails /></ProtectedRoute>} />
          </Routes>
        </main>
        <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="dark"
      />
      </div>
    </Router>
  )
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}

export default App
