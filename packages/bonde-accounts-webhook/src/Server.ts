import Express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import debug, { Debugger } from 'debug'
import invitations from './handles/invitations';
import hasura from './handles/hasura';

dotenv.config()

class Server {
  private server = Express().use(
    Express.json() as any
  )

  private dbg: Debugger

  constructor() {
    this.dbg = debug(process.env.DEBUG)
  }

  private health = async (req: any, res: any) => {
    res.status(200).json({ status: 'running' })
  }

  start = () => {
    const { PORT, HOST } = process.env
    this.server.use(morgan('combined'))
    this.server
      .get('/', this.health.bind(this))
      .get('/hasura', hasura)
      .post('/invitations', invitations)
      .listen(Number(PORT), '0.0.0.0', () => {
        this.dbg(`Webhook Auth Server listen on ${HOST}:${PORT}`)
      })
  }
}

export default Server
