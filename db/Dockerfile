FROM mongo:3.6.2

RUN mkdir /usr/db
WORKDIR /usr
COPY . ./db

CMD mongorestore --host mongo -d review_system db
