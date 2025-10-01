FROM node:24

WORKDIR /app
RUN mkdir data files logs
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 7770

CMD ["npm", "start"]
