import {
  authenticate,
  register,
  reset_password_request,
  reset_password_verify,
  reset_password_change
} from './resolvers'

export const typeDefs = `
	type Query {
    authenticate(email: String!, password: String!): JWT
    reset_password_verify(token: String!): DecodedToken
  }
  type Mutation {
    authenticate(email: String!, password: String!): JWT
    register(input: RegisterInput!): JWT
    reset_password_request(email: String!, callback_url: String!, locale: String): Boolean
    reset_password_verify(token: String!): DecodedToken
    reset_password_change(password: String!, token: String!): JWT
  }
  type JWT { valid: Boolean!, token: String, first_name: String }
  type DecodedToken { id: Int!, expired_at: Int!, iat: Int! }
  input RegisterInput {
    email: String!,
    first_name: String!,
    last_name: String,
    password: String!,
    invitation_code: String!
  }
`

export const resolvers = {
  Query: {
    authenticate,
    reset_password_verify
  },
  Mutation: {
    authenticate,
    register,
    reset_password_request,
    reset_password_verify,
    reset_password_change
  }
}