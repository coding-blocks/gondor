FROM node:12.16.3-alpine3.9 

RUN apk update

COPY ./ ~/gondor

WORKDIR ~/gondor

RUN yarn

RUN yarn build

EXPOSE 3000

CMD [ "yarn", "start" ]
