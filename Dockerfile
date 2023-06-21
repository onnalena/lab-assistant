FROM node:alpine

COPY node_modules/ .

COPY package.json .

CMD ["npm", "serve"]

EXPOSE 4200
