FROM node:12

RUN yarn global add pnpm serve

WORKDIR /usr/src/app

COPY ./ .

RUN pnpm m i --filter bonde-auth --filter client-auth

RUN pnpm m run build --filter client-auth

CMD serve -s ./packages/client-auth/build
