import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../db/models/user.js'

// This function is used to create a new user in the database.
export async function createUser({ username, password }) {
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = new User({ username, password: hashedPassword })
  return await user.save()
}

// This function is used to login a user.
export async function loginUser({ username, password }) {
  const user = await User.findOne({ username })
  if (!user) {
    throw new Error('invalid username!')
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password)
  if (!isPasswordCorrect) {
    throw new Error('invalid password!')
  }
  const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  })
  return token
}

// This function is used to get the user information by the user id.
export async function getUserInfoById(userId) {
  try {
    const user = await User.findById(userId)
    if (!user) return { username: userId }
    return { username: user.username }
  } catch (err) {
    return { username: userId }
  }
}
