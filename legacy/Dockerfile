FROM node:18.14.1-buster

LABEL maintainer="Togglecorp dev@togglecorp.com"

RUN apt-get -y update\
  && apt-get -y install --no-install-recommends git bash

WORKDIR /code
COPY . /code/
