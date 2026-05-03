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
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
       < div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required        />      </div>    
            
              <button type="submit">Login</button>    </form>    </div>  
              )}
              
 export default Register          
