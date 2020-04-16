declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string
    DEBUG: string
    GRAPHQL_HTTP_URL: string
    JWT_SECRET: string
    HASURA_SECRET?: string
  }
}
