import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import DestinationDetail from './pages/DestinationDetail'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* public routes */}
        <Route path="/" element={<Home />} />

        <Route path="/destinations" element={<div className="min-h-screen pt-16 px-4"><h1 className="text-3xl font-bold text-center">Destinations</h1><p className="text-center mt-4">Explore amazing destinations coming soon...</p></div>} />

        {/* Dynamic route using :id */}
        <Route path="/destinations/:id" element={<DestinationDetail />} />

        <Route path="/planner" element={<div className="min-h-screen pt-16 px-4"><h1 className="text-3xl font-bold text-center">Plan Your Visit</h1><p className="text-center mt-4">Trip planning tools coming soon...</p></div>} />

        <Route path="/experiences" element={<div className="min-h-screen pt-16 px-4"><h1 className="text-3xl font-bold text-center">Experiences</h1><p className="text-center mt-4">Discover unique experiences coming soon...</p></div>} />
        
        <Route path="/about" element={<h1>About</h1>} />

        {/* admin routes */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
