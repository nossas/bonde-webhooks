import Express from 'express'
import dotenv from 'dotenv'
import debug, { Debugger } from 'debug'
import jwt from 'jsonwebtoken'
import md5 from 'md5'
import urljoin from 'url-join'
import * as InvitationsAPI from './graphql/invitations'
import * as NotificationsAPI from './graphql/notifications'

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

  private invitations = async (req: any, res: any) => {
    this.dbg(`Start invite to community.`)
    const { id, community_id, user_id, email, role, created_at, callback_url } = req.body.event.data.new
    const code = md5(`${community_id}-${user_id}-${email}-${role}-${created_at}`)
    const invite = await InvitationsAPI.update(id, code)

    const invite_url = urljoin(callback_url, `?code=${invite.code}&email=${invite.email}`)

    const input = {
      email_to: email,
      email_from: 'suporte@bonde.org',
      context: { invite_url, community: invite.community }
    }

    this.dbg(`sending mail...`)
    await NotificationsAPI.send(input, { label: 'invite', locale: 'pt-BR' })

    this.dbg(`Invite is done!`)
    res.status(200).json({ status: 'ok' })
  }

  start = () => {
    const { PORT, HOST } = process.env
    this.server
      .get('/', this.health.bind(this))
      .get('/hasura', this.hasura.bind(this))
      .post('/invitations', this.invitations.bind(this))
      .listen(Number(PORT), '0.0.0.0', () => {
        this.dbg(`Webhook Auth Server listen on ${HOST}:${PORT}`)
      })
  }
}

export default Server
