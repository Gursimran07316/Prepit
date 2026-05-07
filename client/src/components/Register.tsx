// Just created a login page, will add more features later. For now, it just has a form with email and password fields and a submit button.

import { useMutation } from '@tanstack/react-query'
import {  useState } from 'react'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

type UserState={
    email: string;
    password: string;
    name:string
}

type User={
    email: string;
    password: string;
    id: number;
    name:string
}

  const registerUser = async (user: UserState): Promise<User> => {
    try{
      const response = await fetch('http://localhost:5003/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })



      return response.json();
    }catch(err){
        console.log(err);
         throw new Error('Registration failed')
    }
    }
const { mutate }=useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
        console.log('Registration successful:', data)
    },
    onError: (error) => {
        console.error('Registration failed:', error)
    }
})

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault()
    // Handle registration logic here
    mutate({ email, password,name })
    console.log('Email:', email)
    console.log('Password:', password)
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-65px)] px-4">
      <div className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Create account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-md px-4 py-2.5 text-sm transition-colors"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register
