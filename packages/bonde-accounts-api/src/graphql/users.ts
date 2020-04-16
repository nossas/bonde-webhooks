import gql from 'graphql-tag'
import GraphQLAPI from '../GraphQLAPI'

export interface User {
  id: number
  email: string
  first_name: string
  last_name?: string
  encrypted_password?: string
  admin: boolean
  reset_password_token?: string
}

export const insert = async (input: any): Promise<User> => {
  const insertUserMutation = gql`
    mutation createUser ($input: [users_insert_input!]!) {
      insert_users(objects: $input) {
        returning {
          id
          email
          first_name
          admin
        }
      }
    }
  `
  const { data } = await GraphQLAPI.mutate({ mutation: insertUserMutation, variables: { input } })

  return data.insert_users.returning[0]
}

export interface UserUpdateFields {
  encrypted_password?: string
  reset_password_token?: string
}

export const update = async (id: number, fields: UserUpdateFields): Promise<User> => {
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
  const variables = { id, fields }
  const resp = await GraphQLAPI.mutate({ mutation: UpdateUserQuery, variables })
  console.log('resp', resp)
  return resp.data.update_users.returning[0]
}

export interface UserFilter {
  email?: string
  id?: number
  reset_password_token?: string
}

export const find = async (params: UserFilter): Promise<User[]> => {
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

export const relationship = async (input: RelationshipInput): Promise<Relationship> => {
  const InsertCommunityUsersMutation = gql`
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
  const { data } = await GraphQLAPI.mutate({ mutation: InsertCommunityUsersMutation, variables: { input } })

  return data.insert_community_users.returning[0]
}