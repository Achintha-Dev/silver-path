import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// public pages
import Home from './pages/Home'
import DestinationDetail from './pages/user/DestinationDetail'
import AllDestinations from './pages/user/AllDestinations'
import NotFound from './pages/NotFound'

// admin pages
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import DestinationsList from './pages/admin/DestinationsList'
import AddDestination from './pages/admin/AddDestination'
import EditDestination from './pages/admin/EditDestination'
import ProtectedRoute from './components/admin/ProtectedRoute'
import MapPage from './pages/user/MapPage'
import PlannerPage from './pages/user/PlannerPage'

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

        <Route path="/destinations/:id" element={<DestinationDetail />} />

        <Route path="/destinations" element={<AllDestinations/>}/>

        <Route path="/map" element={<MapPage/>}/>

        <Route path="/planner" element={<PlannerPage/>} />
        
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


        {/* 404 page not found */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
