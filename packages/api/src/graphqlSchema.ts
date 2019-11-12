import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { userByEmail } from './queries'

dotenv.config()

export const typeDefs = `
	type Query {
    authenticate(email: String!, password: String!): JWT
  }
  type Mutation {
    authenticate(email: String!, password: String!): JWT
  }
  type JWT { valid: Boolean!, token: String }
`

interface JWT {
  valid: boolean
  token?: string
}

const authenticate = async (root, args, context, info): Promise<JWT> => {
  const { email, password } = args

  const user = await userByEmail(email)
  
  if (!!user && bcrypt.compare(password, user.encrypted_password)) {
    const payload = {
      sub: 'postgraphql',
      role: user.admin ? 'admin' : 'common_user',
      user_id: user.id
    }
    const options = { audience: 'postgraphile' }
    
    const token = jwt.sign(payload, process.env.JWT_SECRET, options)

    return { valid: true, token }
  }
  
  return { valid: false }
}

export const resolvers = {
	Query: {
    authenticate
  },
  Mutation: {
    authenticate
  }
}