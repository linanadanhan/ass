FROM nginx:1.15.1-alpine
MAINTAINER shencq <shencq@g-soft.com.cn>
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/nginx.vh.default.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html