FROM nginx:alpine
RUN <<EOF cat >> /etc/nginx/conf.d/default.conf

server {
  listen       80;
  server_name  localhost;
  location / {
      root   /usr/share/nginx/html;
      try_files $uri /index.html;
}
EOF
COPY skyline_console/static /usr/share/nginx/html
