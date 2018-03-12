FROM node

EXPOSE 3000

RUN apt-get update
RUN apt-get install -y ruby-full && gem install sass

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install

CMD npm run dev