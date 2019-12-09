import gql from 'graphql-tag'
import GraphQLAPI from '../GraphQLAPI'

export interface Community {
  id: number
  name: string
  image?: string
}

export interface Invite {
  id: number
  expired?: boolean
  expires: Date
  role: number
  code: string
  community: Community
  email: string
}

export const update = async (id: number, code: string): Promise<Invite> => {
  const UpdateInvitationQuery = gql`
    mutation UpdateInvitation ($id: Int!, $code: String!) {
      update_invitations(where: { id: { _eq: $id }}, _set: { code: $code }) {
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
  const variables = { id, code }
  const resp = await GraphQLAPI.mutate({ mutation: UpdateInvitationQuery, variables })

  return resp.data.update_invitations.returning[0]
}