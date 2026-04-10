import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* public routes */}
        <Route path="/" element={<Home />} />

        <Route path="/destinations" element={<div className="min-h-screen pt-16 px-4"><h1 className="text-3xl font-bold text-center">Destinations</h1><p className="text-center mt-4">Explore amazing destinations coming soon...</p></div>} />

        <Route path="/planner" element={<div className="min-h-screen pt-16 px-4"><h1 className="text-3xl font-bold text-center">Plan Your Visit</h1><p className="text-center mt-4">Trip planning tools coming soon...</p></div>} />

        <Route path="/experiences" element={<div className="min-h-screen pt-16 px-4"><h1 className="text-3xl font-bold text-center">Experiences</h1><p className="text-center mt-4">Discover unique experiences coming soon...</p></div>} />
        
        <Route path="/about" element={<h1>About</h1>} />

        {/* admin routes */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
