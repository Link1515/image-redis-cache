FROM node:20.9.0

WORKDIR /app

RUN apt-get update && apt-get install -y \
  vim \
  git

COPY package.json ./

RUN npm i

COPY . . 

RUN mv .env.docker .env

CMD npm start

EXPOSE 3031