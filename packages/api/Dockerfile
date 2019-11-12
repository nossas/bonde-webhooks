FROM node:12-alpine

RUN apk --no-cache add --virtual builds-deps build-base python

RUN yarn global add pnpm

WORKDIR /usr/src/app

COPY ./ .

RUN pnpm m i --filter bonde-auth --filter bonde-auth-api

RUN pnpm m run build --filter bonde-auth-api

CMD node ./packages/api/dist
