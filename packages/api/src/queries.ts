import gql from 'graphql-tag'
import GraphQLAPI from './GraphQLAPI'

const UserByEmailQuery = gql`
query users ($email: String!) {
  users (where: { email: { _eq: $email } }) {
    id
    email
    first_name
    last_name
    admin
    encrypted_password
  }
}
`

export interface User {
	id: string
  email: string
  first_name: string
  last_name?: string
  encrypted_password: string
  admin: boolean
}

export const userByEmail = async (email: string): Promise<User | null> => {
	try {
		const variables = { email }
		const resp = await GraphQLAPI.query({ query: UserByEmailQuery, variables })
		if (resp.data && resp.data.users.length > 0) {
			return resp.data.users[0]
		}
		return null
	} catch (err) {
		debugger
		console.log('err', err)
		return null
	}
}