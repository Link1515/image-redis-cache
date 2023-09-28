FROM --platform=linux/amd64 node:16.17.0

WORKDIR /app

RUN apt-get update && apt-get install -y \
  vim \
  git

COPY package.json package-lock.json ./

RUN npm i --platform=linuxmusl

RUN npm i --platform=linux --arch=x64 sharp

COPY . . 

CMD npm start

EXPOSE 3000