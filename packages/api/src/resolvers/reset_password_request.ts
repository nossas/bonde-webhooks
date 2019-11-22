import jwt from 'jsonwebtoken'
import { findUser, updateUser, getTemplate, sendMail } from '../queries'

export default async (root, args): Promise<boolean> => {
  /*const { email, callback_url, locale = 'pt-BR' } = args*/
  const { email, locale, callback_url } = args

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
  
  // get notification with label 'reset_password_instructions'
  const template = await getTemplate(locale)
  
  if (!template) throw new Error('template_not_found')
  
  // insert notify email with envs {{user.callback_url}} {{user.reset_password_token}} 
  const notify = {
    email_from: 'suporte@bonde.org',
    email_to: user.email,
    subject: template.subject_template,
    body: template.body_template,
    context: { user: { callback_url, reset_password_token: hash } }
  }
  await sendMail(notify)
  return true
}