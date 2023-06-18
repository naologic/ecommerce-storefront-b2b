#!/bin/sh

# change dir
cd /var/nao

# Kill all nginx process
kill $(ps aux | grep '[n]ginx' | awk '{print $2}')

# show running processes
ps aux

# demonize pm2
pm2 -v

# show version
nginx -v

echo "nginx: stop"
# force stop nginx
nginx -s stop 2>/dev/null

echo "nginx: check configs"
# nginx: check config
#nginx -c /etc/nginx/nginx.conf

echo "nginx: reload"
echo "----------------------------------------------"
# nginx: reload
#nginx -s reload
sleep 2

echo "nginx: stop"
# Kill all nginx process
kill $(ps aux | grep '[n]ginx' | awk '{print $2}')
echo "----------------------------------------------"
sleep 5

echo "nginx: start"
echo "----------------------------------------------"
# nginx: start (keep in foreground to prevent runner for stopping)
nginx -c /etc/nginx/nginx.conf

sleep 3
echo "----------------------------------------------"
ps aux

echo "----------------------------------------------"
echo "pm2: start"
# node: start the process
pm2-runtime start app.pm2.json --env production
