import bcrypt from 'bcrypt'
import { findUser } from '../queries'
import { JWT } from '../types'
import { generateJWT } from '../utils'

export default async (root, args): Promise<JWT> => {
  const { email, password } = args

  const user = await findUser({ email })
  if (!user) throw new Error('user_not_found')

  if (await bcrypt.compare(password, user.encrypted_password)) {
    return { valid: true, token: generateJWT(user) }
  }
  
  return { valid: false }
}