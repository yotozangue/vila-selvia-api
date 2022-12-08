FROM node:18 as development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

COPY . .


FROM node:18 as production


WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn

COPY . .

RUN yarn add typescript

RUN yarn run build

CMD ["node", "dist/src/index.js"]
