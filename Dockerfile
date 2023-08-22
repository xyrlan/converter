FROM node:18

RUN apt-get update && \
    apt-get install -y imagemagick && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

RUN npm install -g npm

COPY package.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npx tsc --project tsconfig.converter.json

CMD [ "node", "dist/converter/index.js" ]