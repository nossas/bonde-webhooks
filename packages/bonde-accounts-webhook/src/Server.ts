import Express from 'express'
import dotenv from 'dotenv'
import debug, { Debugger } from 'debug'
import jwt from 'jsonwebtoken'
import invitations from './handles/invitations';

dotenv.config()

class Server {
  private server = Express().use(Express.json())

  private dbg: Debugger

  constructor() {
    this.dbg = debug(process.env.DEBUG)
  }

  private health = async (req: any, res: any) => {
    res.status(200).json({ status: 'running' })
  }

  private hasura = async (req: any, res: any) => {
    const authorization = req.get('Authorization')
    const token = authorization ? authorization.replace('Bearer ', '') : null
    jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: any) => {
      if (decoded) {
        const hasuraVariables = {
          'X-Hasura-User-Id': String(decoded.user_id),
          'X-Hasura-Role': decoded.role
        }
        this.dbg(`Logged ${decoded.role} user.`)
        res.status(200).json(hasuraVariables)
      } else if (err.message === 'jwt must be provided') {
        this.dbg('Logged anonymous user.')
        res.status(200).json({ 'X-Hasura-Role': 'anonymous' })
      } else {
        this.dbg('Unauthorized jwt token.')
        res.status(401).json('Unauthorized')
      }
    })
  }

  start = () => {
    const { PORT, HOST } = process.env
    this.server
      .get('/', this.health.bind(this))
      .get('/hasura', this.hasura.bind(this))
      .post('/invitations', invitations)
      .listen(Number(PORT), '0.0.0.0', () => {
        this.dbg(`Webhook Auth Server listen on ${HOST}:${PORT}`)
      })
  }
}

export default Server
