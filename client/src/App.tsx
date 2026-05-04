
import './App.css'
import { Route, Routes } from 'react-router'

import Register from './components/Register'
import Dashboard from './pages/Dashboard'
import Login from './components/Login'
import MainLayout from './layout/MainLayout'
import Home from './pages/Home'
import DashboardLayout from './layout/DashboardLayout'
import ProtectedRoute from './guards/ProtectedRoute'

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
    </Route>
  </Route>
</Routes>
    </>
  )
}

export default App
