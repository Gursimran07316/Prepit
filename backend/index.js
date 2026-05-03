import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import connectDB from './src//config/db.js'
import authRoutes from './src/routes/authRoutes.js'
import dashboardRoutes from './src/routes/dashboardRoutes.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}))

app.use(express.json())

connectDB()

app.use('/api/auth', authRoutes)

app.use('/api/dashboard', dashboardRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})