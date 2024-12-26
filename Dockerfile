FROM hub-dev.hexin.cn/mobileweb/openresty:frontend-1.0

LABEL maintainer "chencongying@myhexin.com"

ENV CODEPATH "/var/www/html/"

COPY ./script /ths_build

RUN sh /ths_build/prepare.sh

COPY ./src/dist $CODEPATH
COPY ./src/.builddep $CODEPATH/.builddep

COPY ./root /

ARG CURRENT_TIME=0

RUN sh /ths_build/build.sh
