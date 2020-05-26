import gql from 'graphql-tag'
import GraphQLAPI from '../GraphQLAPI'

interface Community {
  id: number
  name: string
  image?: string
}

interface Invite {
  id: number
  expired?: boolean
  expires: Date
  role: number
  code: string
  community: Community
  email: string
}

interface InviteUpdateFields {
  code?: string
  expired?: boolean
}

const update = async (id: number, fields: InviteUpdateFields): Promise<Invite> => {
  const UpdateInvitationQuery = gql`
    mutation UpdateInvitation ($id: Int!, $fields: invitations_set_input!) {
      update_invitations(where: { id: { _eq: $id }}, _set: $fields) {
        returning {
					id
			    expired
			    expires
			    role
          code
          email
			    community {
			    	id
			    	name
			    	image
			    }
        }
      }
    }
  `
  const variables = { id, fields }
  const resp = await GraphQLAPI.mutate({ mutation: UpdateInvitationQuery, variables })

  return resp.data.update_invitations.returning[0]
}

export default { update }