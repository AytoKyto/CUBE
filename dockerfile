FROM node:alpine AS next_cube

ADD . /app/

WORKDIR /app

RUN npm install \
&& npm run build

EXPOSE 3000