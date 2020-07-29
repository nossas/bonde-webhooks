import gql from 'graphql-tag'
import GraphQLAPI from '../GraphQLAPI'

export interface User {
  id: number
  email: string
  first_name: string
  last_name?: string
  encrypted_password?: string
  admin: boolean
  is_admin: boolean
  reset_password_token?: string
}

export const InsertUserQuery = gql`
  mutation createUser ($input: [users_insert_input!]!) {
    insert_users(objects: $input) {
      returning {
        id
        email
        first_name
        admin
        is_admin
      }
    }
  }
`

export const insert = async (input: any): Promise<User> => {
  const { data } = await GraphQLAPI.mutate({ mutation: InsertUserQuery, variables: { input } })

  return data.insert_users.returning[0]
}

export interface UserUpdateFields {
  encrypted_password?: string
  reset_password_token?: string
}

export const UpdateUserQuery = gql`
  mutation UpdateUser ($id: Int!, $fields: users_set_input!) {
    update_users(where: { id: { _eq: $id }}, _set: $fields) {
      returning {
        id
        email
        first_name
        last_name
        admin
        is_admin
        encrypted_password
        reset_password_token
      }
    }
  }
`

export const update = async (id: number, fields: UserUpdateFields): Promise<User> => {
  const variables = { id, fields }
  const resp = await GraphQLAPI.mutate({ mutation: UpdateUserQuery, variables })
  
  return resp.data.update_users.returning[0]
}

export interface UserFilter {
  email?: string
  id?: number
  reset_password_token?: string
}

export const UserFilterQuery = gql`
  query users ($where: users_bool_exp!) {
    users (where: $where) {
      id
      email
      first_name
      last_name
      admin
      is_admin
      encrypted_password
      reset_password_token
    }
  }
`

export const find = async (params: UserFilter): Promise<User[]> => {
  let where = {}
  Object.keys(params).forEach((field) => {
    where = Object.assign(where, { [field]: { _eq: params[field] } })
  })
  const resp = await GraphQLAPI.query({ query: UserFilterQuery, variables: { where }, fetchPolicy: 'network-only' })
  return resp.data.users
}

export interface RelationshipInput {
  community_id: number
  user_id: number
  role: number
}

export interface Relationship extends RelationshipInput {
  id: number
}

export const InsertCommunityUsersQuery = gql`
  mutation InsertCommunityUsers($input: community_users_insert_input!) {
    insert_community_users(objects: [$input]) {
      returning {
        id
        user_id
        role
        community_id
      }
    }
  }
`

export const relationship = async (input: RelationshipInput): Promise<Relationship> => {
  const { data } = await GraphQLAPI.mutate({ mutation: InsertCommunityUsersQuery, variables: { input } })

  return data.insert_community_users.returning[0]
}