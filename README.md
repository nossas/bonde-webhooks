# Bonde Accounts

Services for works with authentication on Bonde.org

### Permissions

To understand how permissions are worked on Bonde we need to consider the following models:

```typescript
type User = {
  id: number;
  first_name: string;
  last_name?: string;
  email: string;
  encrypted_password: string;
  is_admin: boolean
}

type Community = {
  id: number;
  name: string;
  city: string;
}

type CommunityUsers = {
  user: User;
  community: Community;
  /** Roles: 1 - Admin | 2 - Mobilizer */
  role: number
}
```

- Users with is_admin `true` has permissions to access all Bonde, used for plataform maintainers.
- Users with is_admin `false` has permissions to access Bonde contextualized by the member community.
- TODO: create levels to access contextualized by community

### Packages

- [API GraphQL](./packages/bonde-accounts-api)
- [Auth Webhook](./packages/bonde-accounts-webhook)
- [Client React](./packages/bonde-accounts-client)

:heart_eyes: Made with love by ![Bonde](./bonde.svg)