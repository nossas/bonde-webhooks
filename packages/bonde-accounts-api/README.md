# Bonde Accounts API README

## Invite an user to Bonde

- Create a community invitation on `API-GraphQL` or `admin-canary`:

```gql
Mutation: insert_invitations
Variables: { role: Number!, community_id: Number!, callback_url: String!, user_id: Number! }
```

- With the generated code check the user registration on `API-Auth`:

```
Mutation: register_verify
Variables: { code: String!, email: String! }
```

**IMPORTANT:** When the user already exists in "Bonde", the relationship between user and community is created and the invitation is invalidated.

The response to this mutation will tell you whether or not to continue user registration:

```
Response: { code: String!, email: String!, isNewUser: Boolean! }
```

- "Are you a new user?", continue with registration on `API-Auth`:

```
Mutation: register
Variables: { input: { code: String!, email: String!, password: String!, first_name: String!, last_name: String } }
```

The user registration response gives you the "token" (JWT) that can be used to authenticate the registered user's next actions.

```
Response: { first_name: String!, valid: Boolean!, token: String! }
```

## Errors code

- `invalid_invitation_code`: throwed on **register** and **register_verify** mutation when code or email is invalid
- `password_lt_six_chars`: throwed on **register** mutation when password is less than 6 caracters
- `email_already_exists`: throwed on **register** mutation when user already exists in Bonde

_________________________________________
<p align='right'>:heart_eyes: Made with love by <b>B</b>onde!</p>