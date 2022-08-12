FROM mcr.microsoft.com/playwright:v1.25.0
WORKDIR /app
RUN yarn add express
COPY server.js .
COPY dist dist
CMD xvfb-run --server-args="-screen 0 1024x768x24" node server.js
