FROM node:lts
WORKDIR /app 
RUN yarn add express
COPY server.js .
COPY dist dist
CMD ["server.js"]
