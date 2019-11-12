FROM node:12-alpine

RUN yarn global add pnpm

WORKDIR /usr/src/app

COPY ./ .

RUN pnpm m i --filter bonde-auth --filter bonde-auth-webhook

RUN pnpm m run build --filter bonde-auth-webhook

CMD node ./packages/webhook/dist
