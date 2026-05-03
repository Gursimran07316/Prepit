import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const protect = async (req, res, next) => {
  try {
    // 👇 your job 1 — get the token from the header
    // hint: req.headers.authorization
    // it looks like "Bearer eyJhbG..."
    // you need to split it and take the second part
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' })
    }

     let userToken=authHeader.split(' ')[1];
    


    // 👇 your job 2 — check if token exists
    // if not return 401 { message: 'Not authorized, no token' }
 if (!userToken){
        return res.status(401).json({ message: 'Not authorized, no token' })
     }

    // 👇 your job 3 — verify the token
    // hint: jwt.verify() takes token and JWT_SECRET
    // it returns the decoded payload { userId: '...' }
    const decoded = jwt.verify(userToken,process.env.JWT_SECRET);


    // 👇 your job 4 — find the user from DB using decoded userId
    // attach it to req.user so controllers can access it
    // hint: User.findById().select('-password')
    // select('-password') excludes password from the result
    const user=await User.findById(decoded.userId).select('-password');
    req.user=user;


    next() // ✅ all good, move to controller

  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' })
  }
}