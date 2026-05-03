import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    // 👇 your job — use mongoose to connect using process.env.MONGO_URI
    // hint: mongoose has a .connect() method

    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env file')
    }
    await mongoose.connect(process.env.MONGO_URI);


    console.log('MongoDB connected')
  } catch (error) {
    console.error('MongoDB connection failed:', error)
    process.exit(1)  // stops the server if DB fails
  }
}

export default connectDB