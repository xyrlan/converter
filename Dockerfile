# Use a base image Node.js
FROM node:18

# Defina o diretório de trabalho no contêiner
WORKDIR /usr/src/app

# Atualize os pacotes e instale o ImageMagick e outras dependências
RUN apt update \
    && apt install -y imagemagick \
    && apt-get clean

# Instale uma versão mais recente do npm
RUN npm install -g npm

# Copie os arquivos do projeto para o diretório de trabalho no contêiner
COPY package.json ./
COPY package-lock.json ./

# Instale as dependências do projeto
RUN npm install

# Copie todo o restante do projeto para o contêiner
COPY . .

# Gere os artefatos de build do projeto
RUN npx prisma generate
RUN npx tsc --project tsconfig.converter.json

# Defina as variáveis de ambiente relacionadas ao ImageMagick
ENV MAGICK_HOME /usr
ENV PATH "$MAGICK_HOME/bin:$PATH"
ENV LD_LIBRARY_PATH "${LD_LIBRARY_PATH:+$LD_LIBRARY_PATH:}$MAGICK_HOME/lib"

# Verifique se o ImageMagick está funcionando corretamente
RUN convert logo: logo.gif
RUN identify logo.gif
RUN display logo.gif

# Comando a ser executado quando o contêiner é iniciado
CMD [ "node", "dist/converter/index.js" ]