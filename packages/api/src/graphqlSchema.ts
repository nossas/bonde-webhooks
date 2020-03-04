import {
  accept_invite,
  authenticate,
  register,
  reset_password_request,
  reset_password_verify,
  reset_password_change
} from './resolvers'

export const typeDefs = `
  input RegisterInput {
    email: String!,
    first_name: String!,
    last_name: String,
    password: String!,
    invitation_code: String
  }
  type DecodedToken { id: Int!, expired_at: Int!, iat: Int! }
  type JWT { valid: Boolean!, token: String, first_name: String }
  type AcceptInvite { email: String!, invitation_code: String!, is_new_user: Boolean! }

	type Query {
    authenticate(email: String!, password: String!): JWT
    reset_password_verify(token: String!): DecodedToken
  }
  type Mutation {
    accept_invite(email: String!, invitation_code: String!): AcceptInvite
    authenticate(email: String!, password: String!): JWT
    register(input: RegisterInput!): JWT
    reset_password_change(password: String!, token: String!): JWT
    reset_password_request(email: String!, callback_url: String!, locale: String): Boolean
    reset_password_verify(token: String!): DecodedToken
  }
`

export const resolvers = {
  Query: {
    authenticate,
    reset_password_verify
  },
  Mutation: {
    accept_invite,
    authenticate,
    register,
    reset_password_request,
    reset_password_verify,
    reset_password_change
  }
}