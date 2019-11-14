import gql from 'graphql-tag'
import GraphQLAPI from './GraphQLAPI'

const UserFilterQuery = gql`
query users ($where: users_bool_exp!) {
  users (where: $where) {
    id
    email
    first_name
    last_name
    admin
    encrypted_password
    reset_password_token
  }
}
`

export interface User {
  id: number
  email: string
  first_name: string
  last_name?: string
  encrypted_password: string
  admin: boolean
  reset_password_token?: string
}

export interface UserFilter {
  email?: string
  id?: number
  reset_password_token?: string
}

export const findUser = async (params: UserFilter): Promise<User | null> => {
  try {
    let where = {}
    Object.keys(params).forEach((field) => {
      where = Object.assign(where, { [field]: { _eq: params[field] } })
    })
    const resp = await GraphQLAPI.query({ query: UserFilterQuery, variables: { where }, fetchPolicy: 'network-only' })
    if (resp.data && resp.data.users.length > 0) {
      return resp.data.users[0]
    }
    return null
  } catch (err) {
    console.log('err', err)
    return null
  }
}

const UpdateUserQuery = gql`
mutation UpdateUser ($id: Int!, $fields: users_set_input!) {
  update_users(where: { id: { _eq: $id }}, _set: $fields) {
		returning {
      id
	    email
	    first_name
	    last_name
	    admin
	    encrypted_password
	    reset_password_token
		}
  }
}
`

export interface UserUpdateFields {
  encrypted_password?: string
  reset_password_token?: string
}

export const updateUser = async (id: number, fields: UserUpdateFields): Promise<User | null> => {
  try {
    const variables = { id, fields }
    const resp = await GraphQLAPI.mutate({ mutation: UpdateUserQuery, variables })
    if (resp.data && resp.data.update_users) {
      return resp.data.update_users.returning
    }
    return null
  } catch (err) {
    console.log('err', err)
    return null
  }
}