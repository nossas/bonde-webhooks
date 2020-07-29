import { mocked } from 'ts-jest/utils'
import GraphQLAPI from '../GraphQLAPI'
import * as UsersAPI from './users'

jest.mock('../GraphQLAPI', () => ({
  query: jest.fn(),
  mutate: jest.fn()
}))

const graphqlMocked = mocked(GraphQLAPI);

describe('graphql users api', () => {
  const user = {
    id: 234,
    email: 'test@test.org',
    first_name: 'Test',
    last_name: 'Test',
    admin: true,
    is_admin: false,
    encrypted_password: 'asxafascasdasdasd',
    reset_password_token: ''
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find user by filter params no-cache', () => {
    const result = { data: { users: [user] } };
    graphqlMocked.query.mockResolvedValue(result as any);
    const filters = { email: 'test@test.org' }
    
    return UsersAPI.find(filters)
      .then((users: any) => {
        expect(users[0]).toEqual(user);
        expect(graphqlMocked.query).toHaveBeenCalledTimes(1);
        expect(graphqlMocked.query).toHaveBeenCalledWith({
          query: UsersAPI.UserFilterQuery,
          variables: { where: { email: { _eq: filters.email } } },
          fetchPolicy: 'network-only'
        })
      })
  })

  it('should update fields on user', () => {
    const updateFields = { encrypted_password: 'aasxasxasxas' }
    const result = {
      data: {
        update_users: {
          returning: [
            { ...user, ...updateFields }
          ]
        }
      }
    };
    graphqlMocked.mutate.mockResolvedValue(result as any);

    return UsersAPI.update(user.id, updateFields)
      .then((updatedUser: any) => {
        expect(updatedUser).toEqual({...user, ...updateFields});
        expect(graphqlMocked.mutate).toHaveBeenCalledTimes(1);
        expect(graphqlMocked.mutate).toHaveBeenCalledWith({
          mutation: UsersAPI.UpdateUserQuery,
          variables: { id: user.id, fields: updateFields }
        });
      });
  });

  it('should insert user', () => {
    const newUser = {
      email: 'test@test.org',
      first_name: 'Test',
      encrypted_password: 'axasxasx',
      admin: true,
      is_admin: false
    };
    const result = {
      data: {
        insert_users: {
          returning: [
            {
              id: 8,
              email: newUser.email,
              first_name: newUser.first_name,
              admin: newUser.admin,
              is_admin: newUser.is_admin
            }
          ]
        }
      }
    };
    graphqlMocked.mutate.mockResolvedValue(result as any);

    return UsersAPI.insert(newUser)
      .then((addedUser: any) => {
        expect(addedUser).toEqual(result.data.insert_users.returning[0]);
        expect(graphqlMocked.mutate).toHaveBeenCalledTimes(1);
        expect(graphqlMocked.mutate).toHaveBeenCalledWith({
          mutation: UsersAPI.InsertUserQuery,
          variables: { input: newUser }
        });
      });
  });

  it('should create user relationship community', () => {
    const input = { user_id: user.id, community_id: 3, role: 2 };
    const result = {
      data: {
        insert_community_users: {
          returning: [
            { ...input, id: 234 }
          ]
        }
      }
    };
    graphqlMocked.mutate.mockResolvedValue(result as any);

    return UsersAPI.relationship(input)
      .then((addedRelationship: any) => {
        expect(addedRelationship).toEqual({ ...input, id: 234 });
        expect(graphqlMocked.mutate).toHaveBeenCalledTimes(1);
        expect(graphqlMocked.mutate).toHaveBeenCalledWith({
          mutation: UsersAPI.InsertCommunityUsersQuery,
          variables: { input }
        });
      });
  });
});