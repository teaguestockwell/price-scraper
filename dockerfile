FROM ghcr.io/puppeteer/puppeteer:16.1.0
WORKDIR /app 
RUN yarn add express
COPY server.js .
COPY dist .
RUN apt-get update
RUN apt install -y xvfb
# CMD ["node", "server.js"]
