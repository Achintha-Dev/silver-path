import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<h1>About</h1>} />

        {/* admin routes */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
