FROM node:18.16.0-alpine3.17 as builder

RUN mkdir -p /home/node/app
WORKDIR /home/node/app
COPY package*.json .
RUN npm install --production

COPY . .
RUN npm run build-prod
RUN chown -R node:node /home/node/app

FROM node:18.16.0-alpine3.17
EXPOSE 10020

USER node
COPY --from=builder /home/node/app /home/node/app
WORKDIR /home/node/app

CMD [ "npm", "run", "start"]