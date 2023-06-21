# -*- mode: nginx -*-

server {
        listen 80 default_server;
        listen [::]:80 default_server;

        root /var/www/html;
        index index.html index.htm index.nginx-debian.html;

        server_name kintai.inctore.com;

        location / {
                try_files $uri $uri/ =404;
        }
}
