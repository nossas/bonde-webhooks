import debug, { Debugger } from 'debug'
import { Register } from '../types'
import * as InvitationsAPI from '../graphql/invitations'
import * as UsersAPI from '../graphql/users'

const dbg: Debugger = debug(process.env.DEBUG)

export default async (_root, args: any): Promise<Register> => {
  const { email, code } = args
  dbg(`Request a new register code { ${email}, ${code} }`)

  // Validate fields
  // find throw error when not found
  const invite = await InvitationsAPI.find({ code, email })
  const user = (await UsersAPI.find({ email }))[0]

  if (user) {
    dbg(`Users exists create a relationship { user_id: ${user.id}, community_id: ${invite.community.id} }`)

    // Relationship community and users
    await UsersAPI.relationship({ role: invite.role, community_id: invite.community.id, user_id: user.id })
    // Done invite to not reuse
    await InvitationsAPI.done(invite.id)
    // Response to client that users has relationship
    
    dbg(`Request is done { ${email}, ${code} }`)
    return { code, email, isNewUser: false }
  }

  dbg(`Request is done { ${email}, ${code} }`)
  // Response to client should continuous register user
  return { code, email, isNewUser: true }
}