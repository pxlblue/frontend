# build stage
FROM node:14-alpine AS build-stage
WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY yarn.lock /usr/src/app
RUN yarn
COPY ./ /usr/src/app
RUN yarn build:prod

FROM nginx:mainline-alpine
COPY --from=build-stage /usr/src/app/build/ /usr/share/nginx/html
COPY --from=build-stage /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf
