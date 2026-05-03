
import './App.css'
import { Route, Routes } from 'react-router'

import Register from './components/Register'
import Dashboard from './pages/Dashboard'
import Login from './components/Login'

function App() {


  return (
    <>
<Routes>
  <Route path="/" element={<Login />} />  
  <Route path="/register" element={<Register />} />  
  <Route path="/dashboard" element={<Dashboard />} />
</Routes>
    </>
  )
}

export default App
