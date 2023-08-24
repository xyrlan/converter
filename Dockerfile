FROM node:18

WORKDIR /usr/src/app

RUN apt update 
RUN apt install -y build-essential libjpeg-dev libpng-dev libtiff-dev
RUN apt install -y imagemagick

RUN npm install -g npm

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

RUN npx prisma generate
RUN npx tsc --project tsconfig.converter.json

CMD [ "node", "dist/converter/index.js" ]