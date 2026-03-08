import { useState } from 'react'
import React from 'react'
import toast from "react-hot-toast"
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import CreateTeam from './pages/CreateTeam.jsx'
import JoinTeam from './pages/JoinTeam.jsx'
import TeamDashboard from './components/TeamDashboard.jsx'
import ReportBug from './pages/ReportBug.jsx'
import BugDetails from './components/BugDetailPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
const App = () => {
  return (

    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path='/signup' element={<Signup />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/teams/create" element={<CreateTeam />} />
        <Route path="/teams/join" element={<JoinTeam />} />
        <Route path="/teams/:teamId/*" element={<TeamDashboard />} />
        <Route path="/teams/:teamId/bugs/report" element={<ReportBug />} />
        <Route path="/teams/:teamId/bug/:bugId" element={<BugDetails />} />
      </Route>
    </Routes>

  )
}

export default App
