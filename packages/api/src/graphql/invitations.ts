import gql from 'graphql-tag'
import GraphQLAPI from '../GraphQLAPI'

export interface Invite {
	expired?: boolean
	expires: Date
	role: number
	community_id: number
}

export interface FilterInvitation {
	code: string
	email: string
}

export const find = async (variables: FilterInvitation): Promise<Invite> => {
	const FilterInvitationsQuery = gql`
		query Invitations($code: String!, $email: String!) {
		  invitations(
		    where: {
		      _and: {
		        code: { _eq: $code },
		        email: { _eq: $email },
		        expired: { _is_null: true }
		      }
		    }
			) {
		    expired
		    expires
		    role
		    community_id
		  }
		}
	`

  const resp = await GraphQLAPI.query({ query: FilterInvitationsQuery, variables, fetchPolicy: 'network-only' })
  if (resp.data && resp.data.invitations.length > 0) {
    return resp.data.invitations[0]
  }
  throw new Error('invitation_code_expired')
}