import jwt from 'jsonwebtoken'
import { findUser, updateUser } from '../queries'

export default async (root, args): Promise<boolean> => {
  /*const { email, callback_url, locale = 'pt-BR' } = args*/
  const { email } = args

  // find user on database
  const user = await findUser({ email })

  if (!user) throw new Error('user_not_found')
  // token expires after 48 hours
  const today = new Date()
  const expired_at = new Date(today.setUTCDate(today.getUTCDate() + 2))
  const payload = {
    id: user.id,
    // fix timestamp to convert
    expired_at:  String(expired_at.getTime()).substring(0, 10)
  }
  const hash = jwt.sign(payload, process.env.JWT_SECRET)
  await updateUser(user.id, { reset_password_token: hash })
  // TODO: send mail
  return true
}