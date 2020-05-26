import Express from 'express'
import debug, { Debugger } from 'debug'
import bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { makeExecutableSchema } from 'graphql-tools'
import { typeDefs, resolvers } from './graphqlSchema'

// Configure graphql schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

class Server {
  private server = Express().use(Express.json());

  private dbg: Debugger;

  constructor() {
    this.dbg = debug(process.env.DEBUG);
  }

  private health = async (req: any, res: any) => {
    res.status(200).json({ status: 'running' });
  }

  start = () => {
    const { PORT, HOST } = process.env;
    this.server
      .get('/', this.health.bind(this))
      .use('/graphql', bodyParser.json(), graphqlExpress({ schema }))
      .use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))
      .listen(Number(PORT), '0.0.0.0', () => {
        this.dbg(`API Auth Server listen on ${HOST}:${PORT}`)
      });
  };
};

export default Server
