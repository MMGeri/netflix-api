FROM node:lts-alpine as builder

RUN mkdir -p /home/node/app
WORKDIR /home/node/app
COPY package*.json .
RUN npm install --omit=dev

COPY . .
RUN npm run build-prod
RUN chown -R node:node /home/node/app

FROM node:lts-alpine
EXPOSE 10020

USER node
COPY --from=builder /home/node/app /home/node/app
WORKDIR /home/node/app


CMD [ "npm", "run", "start"]