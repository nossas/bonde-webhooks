### Modos de autenticação (Hasura)

- Webhook

No modo de autenticação por webhook o Hasura recebe um token JWT que é transferido para o webhook, neste momento o token é validado e traduzido pelo webhook que como resposta da requisição informa as variaveis de sessão com as informações pertinentes ou 401 em caso de acesso negado.

- JWT

Nesse modo de autenticação, o Hasura já espera dentro do token as informações como `X-Hasura-Role` e `X-Hasura-User_ID`


### Anotações

- Nos 2 modos de autenticação o Hasura espera um token gerado por um serviço externo

- Quais serviços do Bonde são autenticados?

	- bonde-admin e bonde-admin-canary (web-apps/bonde-client):
		- `cross-storage` faz o controle de sessão para multi-app (web-apps que compartilham a mesma sessão em um mesmo dispositivo)
	- chatbot (bonde-bot):
		- Usa `HASURA_SECRET` para autenticar na `API-GRAPHQL`
		- Não tem nível de controle de acesso, acesso total aos dados como administrador
	- mapa-services:
		- Usa `HASURA_SECRET` para autenticar na `API-GRAPHQL`
		- Não tem nível de controle de acesso, acesso total aos dados como administrador

- Como é feita a autenticação atual?
	
	- Token JWT para API-REST
		- Serviço que modelou a base de dados para autenticação
		- Resgata informações do token e realiza o controle de acesso "manualmente"
		- Padrão de dados em `CamelCase`

	- Token JWT para API-GRAPHQL
		- Hasura configurado em modo webhook
		- Webhook resgata informações do token e faz um de:para respondendo a requisição
		- Padrão de dados em `snake_case`

	- Token JWT para API-V2
		- Serviço que gera o token atráves da mutation `authenticate` e `register`
		- Resgata informações do token e realiza o controle de acesso "manualmente"
		- Disponibiliza também funções para reset de senha
		- Padrão de dados em `CamelCase`

### Algumas funções contidas na API-v2

```js
- authenticate(email: text, password: text): JWT Token
// Verificar informações de acesso, acesso concedio devolve JWT Token para requisições futuras, acesso negado resposta é { jwtToke: null }

- register({ first_name: text, email: text, password: text, last_name?: text, invitation_code?: text }): JWT Token
// Criar um novo usuário, se receber invitation_code já relaciona usuário a comunidade que foi convidado

- change_password({ password: text, password_confirmation: text, reset_password_token?: text }: json): JWT Token
// Alterar senha do usuário, se usuário não estiver logado requer reset_password_token

- reset_password_change_password(new_password: text, token: text): { user_first_name: text, user_last_name: text, token: text }
// Alterar o password do usuário se o token for válido e retorna um objeto com o JWT Token.

- reset_password_token_request(email: text, callback_url: text, locale: text): void
// Criar a notificação que irá disparar os e-mails, faz uso de custom templates.

- reset_password_token_verify(token: text): JSON
// Retornar informações contidas no token, caso este seja válido.
```

### Outras lógicas que possuem funções dentro do API-v2

- mobilizações
- BETA
- dados estatisticos
- twilio
- user
- tags
- templates
- comunidade (convite de membros)