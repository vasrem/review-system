FROM node:carbon

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000
ENV DOMAIN=mongo

CMD ["npm","start"]
