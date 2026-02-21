import React from 'react'
import { Routes, Route } from 'react-router-dom'

// Layouts
import MainLayout from './components/MainLayout'

// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import MainMenu from './pages/MainMenu'
import Assessment from './pages/Assessment'
import PersonalityAssessment from './pages/PersonalityAssessment'
import InterestAssessment from './pages/InterestAssessment'
import CareerRoadmap from './pages/CareerRoadmap'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes (we can add auth checking later) */}
      <Route element={<MainLayout />}>
        <Route path="/main" element={<MainMenu />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/personality_assessment" element={<PersonalityAssessment />} />
        <Route path="/interest_assessment" element={<InterestAssessment />} />
        <Route path="/career_roadmap" element={<CareerRoadmap />} />
      </Route>
    </Routes>
  )
}

export default App
