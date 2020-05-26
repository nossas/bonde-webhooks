import {
  authenticate,
  register,
  register_verify,
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
    code: String!
  }
  type DecodedToken { id: Int!, expired_at: Int!, iat: Int! }
  type JWT { valid: Boolean!, token: String, first_name: String }
  type Register { code: String!, email: String!, isNewUser: Boolean! }

	type Query {
    authenticate(email: String!, password: String!): JWT
    register_verify(code: String!, email: String!): Register
    reset_password_verify(token: String!): DecodedToken
  }
  type Mutation {
    authenticate(email: String!, password: String!): JWT
    register(input: RegisterInput!): JWT
    register_verify(code: String!, email: String!): Register
    reset_password_change(password: String!, token: String!): JWT
    reset_password_request(email: String!, callback_url: String!, locale: String): Boolean
    reset_password_verify(token: String!): DecodedToken
  }
`

export const resolvers = {
  Query: {
    authenticate,
    register_verify,
    reset_password_verify
  },
  Mutation: {
    authenticate,
    register,
    register_verify,
    reset_password_request,
    reset_password_verify,
    reset_password_change
  }
}