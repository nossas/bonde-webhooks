export interface JWT {
  valid: boolean
  token?: string
}

export interface DecodedToken {
  id: number
  expired_at: number
  iat: number
}