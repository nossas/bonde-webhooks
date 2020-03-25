import * as InvitationsAPI from '../graphql/invitations'
import * as UsersAPI from '../graphql/users'

export interface AcceptInviteResponse {
  email: string
  invitation_code: string
  is_new_user: boolean
}

export default async (root, args): Promise<AcceptInviteResponse> => {
  const { email, invitation_code } = args

  const invite = await InvitationsAPI.find({ email, code: invitation_code })
  const user = (await UsersAPI.find({ email }))[0]

  /** A database change is only performed when the user already exists,
  	* then creates the relationship and informs the requester that the user
  	* already existed so that he can make the necessary redirect.
  	*/
  if (!!user) {
  	// relationship community and user
  	await UsersAPI.relationship({ user_id: user.id, community_id: invite.community.id, role: invite.role })
  	// become invitation invalid
  	await InvitationsAPI.done(invite.id)

  	return { email, invitation_code, is_new_user: false }
  }
  
  return { email, invitation_code, is_new_user: true }
}