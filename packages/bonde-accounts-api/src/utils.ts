import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()

export const generateJWT = (user: any) => {
  const payload = {
    sub: 'postgraphql',
    role: user.admin ? 'admin' : 'common_user',
    user_id: user.id
  }
  const options = { audience: 'postgraphile' }
  
  return jwt.sign(payload, process.env.JWT_SECRET, options)
}