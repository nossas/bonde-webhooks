import bcrypt from 'bcrypt'

import { findUser, createUser } from '../queries'
import { JWT } from '../types'
import { generateJWT } from '../utils'

export default async (root, args): Promise<JWT> => {
  const { input: { email, first_name, last_name, password, invitation_code } } = args

  // Validate fields
  if (password.length < 8) throw new Error('password_lt_six_chars')
  if (await findUser({ email })) throw new Error('email_already_exists')
  
  // Create user
  const hash = await bcrypt.hash(password, 9)
  const user = await createUser({
    uid: email,
    provider: 'email',
    email,
    encrypted_password: hash,
    first_name,
    last_name,
    admin: false
  })

  if (!!user) {
    // Generate token
    return { first_name: user.first_name, valid: true, token: generateJWT(user) }
  }

  return { valid: false }
}



/**
  * TODO:
  * mutation register (input: RegisterInput): JWT
  * - [ ] Só pode ser acessado por um usuário não autenticado. role: anonymous
  * - [X] Preenchimento obrigatório de "first_name", "email", "password"
  * - [X] Validação para "password" > 6 caracteres
  * - [X] Criar usuário com "password" criptografado no banco de dados
  * - [ ] Verificar "invite_code" para fazer relação com comunidade convidada
  * - [X] Todos os usuários são criados por padrão com role: common_user
  * - [ ] Enviar e-mail com modelo de template "welcome_user" para usuário criado
  */