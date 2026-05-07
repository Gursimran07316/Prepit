
import './App.css'
import './index.css';
import { Route, Routes } from 'react-router'

import Register from './components/Register'
import Dashboard from './pages/Dashboard'
import Login from './components/Login'
import MainLayout from './layout/MainLayout'
import Home from './pages/Home'
import DashboardLayout from './layout/DashboardLayout'
import ProtectedRoute from './guards/ProtectedRoute'
import Interview from './pages/Interview'

function App() {


  return (
    <>
<Routes>
  <Route element={<MainLayout />}>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
  </Route>

  <Route element={<ProtectedRoute />}>
    <Route element={<DashboardLayout />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/session/:sessionId" element={<Interview />} />
    </Route>
  </Route>
</Routes>
    </>
  )
}

export default App
