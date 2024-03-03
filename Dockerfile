FROM node:lts as builder
# Quick and dirty dockerifle
MAINTAINER Andor Kesselman <andor@andor.us>
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build
ENV HOST 0.0.0.0
EXPOSE 3000
CMD [ "yarn", "serve" ]
