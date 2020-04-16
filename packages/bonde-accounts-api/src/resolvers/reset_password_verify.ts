import jwt from 'jsonwebtoken'
import { DecodedToken } from '../types'
import * as UsersAPI from '../graphql/users'

export default async (root, args): Promise<DecodedToken> => {
  const { token } = args
  const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken
  
  if (!decoded) throw new Error('invalid_token')

  const expired_at = decoded.expired_at
  const now = String(new Date().getTime()).substring(0, 10)
  if (Number(now) > Number(expired_at)) throw new Error('invalid_token')

  const user = (await UsersAPI.find({ id: decoded.id, reset_password_token: token }))[0]
  if (!user) throw new Error('invalid_token')

  return decoded
}