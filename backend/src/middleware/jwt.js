import { expressjwt } from 'express-jwt'

// This middleware requires credentials
export const requireAuth = expressjwt({
  secret: () => process.env.JWT_SECRET,
  algorithms: ['HS256'],
})

// This middleware does not require credentials
export const optionalAuth = expressjwt({
  secret: () => process.env.JWT_SECRET,
  algorithms: ['HS256'],
  credentialsRequired: false,
})
