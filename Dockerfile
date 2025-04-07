FROM node:alpine

WORKDIR WORKDIR /usr/cli-com-typescrip

COPY package*.json ./

RUN npm install

COPY . .

VOLUME ["/usr/cli-com-typescript/app"]

CMD ["npm", "run", "dev"]