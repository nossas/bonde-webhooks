import bcrypt from 'bcrypt'
import { JWT } from '../types'
import { generateJWT } from '../utils'
import * as UsersAPI from '../graphql/users'
import * as InvitationsAPI from '../graphql/invitations'

export default async (root, args): Promise<JWT> => {
  const { input: { email, first_name, last_name, password, invitation_code } } = args

  // Validate fields
  if (password.length < 8) throw new Error('password_lt_six_chars')
  if ((await UsersAPI.find({ email })).length > 0) throw new Error('email_already_exists')
  
  const values = {
    uid: email,
    provider: 'email',
    email,
    first_name,
    last_name,
    admin: false,
    encrypted_password: await bcrypt.hash(password, 9),
    community_users: {}
  }

  if (invitation_code) {
    const invite = await InvitationsAPI.find({ code: invitation_code, email })
    values.community_users = { data: { role: invite.role, community_id: invite.community_id } }
  }

  // Create user and generate token
  const user = await UsersAPI.insert(values)

  return { first_name: user.first_name, valid: true, token: generateJWT(user) }
}



/**
  * TODO:
  * mutation register (input: RegisterInput): JWT
  * - [ ] Só pode ser acessado por um usuário não autenticado. role: anonymous
  * - [X] Preenchimento obrigatório de "first_name", "email", "password"
  * - [X] Validação para "password" > 6 caracteres
  * - [X] Criar usuário com "password" criptografado no banco de dados
  * - [X] Verificar "invite_code" para fazer relação com comunidade convidada
  * - [X] Todos os usuários são criados por padrão com role: common_user
  * - [ ] Enviar e-mail com modelo de template "welcome_user" para usuário criado
  */