FROM node

ENV ORIGIN = 'http://localhost:3000'
ENV HOST = 'localhost'
ENV PORT = 3000
ENV SERVICE_URL = 'http://management.dogannet.tv'
ENV PREVIEW_URL = 'http://preview.dogannet.tv'
ENV DELIVERY_URL = 'http://delivery.dogannet.tv'
ENV IMAGE_BASE_URL = 'http://assets.dogannet.tv/img'
ENV MONGO_URL = 'mongodb://mongo/quark_v3_output'

EXPOSE 3000

RUN apt-get update

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install

RUN npm run build

CMD npm start