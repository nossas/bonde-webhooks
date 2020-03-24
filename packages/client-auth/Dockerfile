FROM node:12
MAINTAINER Nossas <tech@nossas.org>

WORKDIR /usr/src/app

RUN npm install -g serve

COPY . .

CMD serve -s packages/client-auth/build
