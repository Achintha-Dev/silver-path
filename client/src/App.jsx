import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// public pages
import Home from './pages/Home'

// admin pages
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import DestinationsList from './pages/DestinationsList'
import AddDestination from './pages/AddDestination'
import EditDestination from './pages/EditDestination'
import ProtectedRoute from './components/admin/ProtectedRoute'

function App() {

  return (
    <BrowserRouter>

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff',
          },
        }}
      />

      <Routes>
        {/* public routes */}
        <Route path="/" element={<Home />} />

        <Route path="/destinations" element={<div className="min-h-screen pt-16 px-4"><h1 className="text-3xl font-bold text-center">Destinations</h1><p className="text-center mt-4">Explore amazing destinations coming soon...</p></div>} />

        {/* Dynamic route using :id */}
        {/* <Route path="/destinations/:id" element={<DestinationDetail />} /> */}

        <Route path="/planner" element={<div className="min-h-screen pt-16 px-4"><h1 className="text-3xl font-bold text-center">Plan Your Visit</h1><p className="text-center mt-4">Trip planning tools coming soon...</p></div>} />

        <Route path="/experiences" element={<div className="min-h-screen pt-16 px-4"><h1 className="text-3xl font-bold text-center">Experiences</h1><p className="text-center mt-4">Discover unique experiences coming soon...</p></div>} />
        
        <Route path="/about" element={<h1>About</h1>} />

         {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/admin/destinations" element={
          <ProtectedRoute><DestinationsList /></ProtectedRoute>
        } />
        <Route path="/admin/destinations/add" element={
          <ProtectedRoute><AddDestination /></ProtectedRoute>
        } />
        <Route path="/admin/destinations/edit/:id" element={
          <ProtectedRoute><EditDestination /></ProtectedRoute>
        } />

        {/* 404 */}
        {/* <Route path="*" element={<ComingSoon title="404 — Page Not Found" />} /> */}

      </Routes>
    </BrowserRouter>
  )
}

export default App
