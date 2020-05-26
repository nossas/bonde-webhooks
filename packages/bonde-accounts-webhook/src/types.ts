export type Invite = {
  id: number
  community_id: number
  user_id: number
  email: string
  role: number
  created_at: string
}

export interface Event<T> {
  event: {
    data: {
      new: T
    }
  }
}

export interface EventRequest<T> {
  body: Event<T>
  headers?: any
}