FROM node

ENV PORT 3000

EXPOSE ${PORT}

RUN apt-get update

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install

CMD npm run build && npm start
#CMD npm run dev