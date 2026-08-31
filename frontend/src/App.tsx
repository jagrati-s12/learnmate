import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </Router>
  )
}

function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        LearnMate AI
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        SSC JE Civil Engineering Preparation Platform
      </p>
      <div className="flex gap-4">
        <a
          href="/login"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </a>
        <a
          href="/register"
          className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition"
        >
          Register
        </a>
      </div>
    </div>
  )
}

function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Login</h2>
        <p className="text-gray-600">Login form coming in Phase 1</p>
      </div>
    </div>
  )
}

function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Register</h2>
        <p className="text-gray-600">Registration form coming in Phase 1</p>
      </div>
    </div>
  )
}

export default App
