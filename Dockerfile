FROM node:latest


RUN mkdir -p /app
RUN chmod 775 /app
WORKDIR /app

COPY package*.json /app
# COPY config.json /app
RUN npm install


COPY . /app
EXPOSE 3000

CMD ["npm", "start"]