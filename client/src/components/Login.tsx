// src/pages/Login.tsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../context/authContext'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  // 👇 your job 1 — setup state for email, password, error, isLoading
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [error,setError]=useState('');
  const [isLoading,setIsLoading]=useState(false);
  


  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    // 👇 your job 2 — set loading true, clear previous error
      setIsLoading(true);
      setError('');


    try {
      // 👇 your job 3 — call login() with email and password
      // on success navigate to /dashboard
      await login(email,password);
      navigate('/dashboard');



    } catch (err) {
      // 👇 your job 4 — set error message 'Invalid email or password'
      //                  set loading false
      setError('Invalid email or password');
      setIsLoading(false);
    }
  }

  return (
    <div>
      <h1>Login</h1>

      {/* 👇 your job 5 — show error message if error exists */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>

        {/* 👇 your job 6 — email input controlled */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />    


        {/* 👇 your job 7 — password input controlled */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />


        {/* 👇 your job 8 — submit button */} 
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        {/* disabled when isLoading */}
        {/* text shows 'Logging in...' when loading, 'Login' when not */}

      </form>

      {/* 👇 your job 9 — link to register page */}
      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  )
}

export default Login