FROM node:18-alpine
WORKDIR /usr/src/app

RUN \ 
  echo "http://dl-cdn.alpinelinux.org/alpine/edge/main" > /etc/apk/repositories \
  && echo "http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories \
  && echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories \
  && echo "http://dl-cdn.alpinelinux.org/alpine/v3.16/main" >> /etc/apk/repositories \
  && apk upgrade -U -a \
  && apk add \
  libstdc++ \
  # chromium \
  harfbuzz \
  nss \
  freetype \
  ttf-freefont \
  font-noto-emoji \
  wqy-zenhei \
  && apk add --no-cache tini \
  && rm -rf /var/cache/* \
  && mkdir /var/cache/apk \
  && apk add --no-cache openvpn \
  && apk add xvfb fluxbox tmux x11vnc st \
  && apk add xvfb-run


# ENV \
#   PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
#   CHROME_BIN=/usr/bin/chromium-browser \
#   CHROME_PATH=/usr/lib/chromium/

RUN yarn add express puppeteer
COPY server.js .
COPY dist dist
RUN chmod +x -R /usr/

ENTRYPOINT ["tini", "--"]
CMD xvfb-run --server-args="-screen 0 1024x768x24" node server.js
