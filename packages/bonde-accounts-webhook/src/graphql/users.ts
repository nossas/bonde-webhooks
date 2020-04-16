import gql from 'graphql-tag'
import GraphQLAPI from '../GraphQLAPI'

export interface User {
  id: number;
  email: string;
}

export const find = async (email: string): Promise<User | undefined> => {
  const FindUserQuery = gql`
    query UserInfo($email: String!) {
      users (where: { email: { _eq: $email } }) {
        id
        email
      }
    }
  `;

  const variables = { email };
  const resp = await GraphQLAPI.query({ query: FindUserQuery, variables });

  return resp.data.users[0];
}

export interface CommunityUsers {
  id?: number;
  user_id: number;
  community_id: number;
  role: number;
}

export const relationship = async (communityUsers: CommunityUsers): Promise<CommunityUsers> => {
  const InserCommunityUsersQuery = gql`
    mutation InserCommunityUsers($input: [community_users_insert_input!]!) {
      insert_community_users(objects: $input) {
        returning {
          id
          user_id
          community_id
          role
        }
      }
    }
  `;

  const variables = { input: communityUsers }
  const resp = await GraphQLAPI.mutate({ mutation: InserCommunityUsersQuery, variables })

  return resp.data.insert_community_users.returning[0]
}