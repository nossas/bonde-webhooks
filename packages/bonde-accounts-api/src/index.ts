import debug, { Debugger } from 'debug'
import { ApolloServer } from 'apollo-server'
import { typeDefs, resolvers } from './graphqlSchema'

const dbg: Debugger = debug(process.env.DEBUG);

// Configure graphql schema
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  dbg(`API Auth Server listen on ${url}`);
});


