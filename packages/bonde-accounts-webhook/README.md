# Bonde Accounts Webhooks README

TODO:
- [ ] Health service

## Documentation

### Authorization

Decode for JSON Web Tokens authentication (https://docs.hasura.io/1.0/graphql/manual/auth/authentication/webhook.html)

**Endpoint:** `/hasura`
**Headers:**
```
{ Authorization?: string }
```
**Response 200 (no token):**
```
{ X-Hasura-Role: 'anonymous' }
```
**Response 200 (valid token):**
```
{ X-Hasura-User-Id: user_id, X-Hasura-Role: role }
```
**Response 401 (invalid token):**
```
Unauthorized
```

### Invite

Responsible for relating an existing User to the Community (`community_users`) or when a User without registration must generate an invitation code for registration (`invitations`).

Creates an e-mail record (`notify_mail`) at the end of the processing informing the user that he / she has been invited to the community, in case users not yet registered send a link to register.

**Endpoint:** `/invitations`

**Request:**

```
{
  event: {
    data: {
      new: {
        id: number;
        community_id: number;
        user_id: number;
        email: string;
        role: number;
        created_at: string;
      }
    }
  }
}
```

**Response (200):**
```
{ status: 'ok' }
```

## Services

- API-GraphQL
- Data Structure (Users, Communities, Invitations, Notify Mail, Community Users)

## Getting started

Clone repository:

```
git clone https://github.com/nossas/bonde-auth.git
```

Install dependencies and run the local server:

```
cd bonde-auth
pnpm m i
pnpm m run dev --filter bonde-accounts-webhook
```

Tests:

```
pnpm m run test --filter bonde-accounts-webhook
```

Lint:

```
pnpm m run lint --filter bonde-accounts-webhook
```

Build:

```
pnpm m run build --filter bonde-accounts-webhook
pnpm m run start --filter bonde-accounts-webhook
```
_________________________________________
<p align='right'>:heart_eyes: Made with love by <b>B</b>onde!</p>
