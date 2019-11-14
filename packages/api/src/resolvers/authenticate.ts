import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { findUser } from '../queries'
import { JWT } from '../types'

export default async (root, args): Promise<JWT> => {
  const { email, password } = args

  const user = await findUser({ email })
  if (!user) throw new Error('user_not_found')

  const isValid = await bcrypt.compare(password, user.encrypted_password)
  
  if (isValid) {
    const payload = {
      sub: 'postgraphql',
      role: user.admin ? 'admin' : 'common_user',
      user_id: user.id
    }
    const options = { audience: 'postgraphile' }
    
    const token = jwt.sign(payload, process.env.JWT_SECRET, options)

    return { valid: true, token }
  }
  
  return { valid: false }
}