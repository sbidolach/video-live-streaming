# Web socket server
start cmd.exe /k "node server-stream.js temp123 8082 8084 base64"
start cmd.exe /k "node server-stream.js temp123 9082 9084"

# Image streaming
start cmd.exe /k "ffmpeg -f vfwcap -i 0 -f image2 -vcodec mjpeg -b:v 500k -r 21 -q:v 10 -s 640x480 http://127.0.0.1:8082/temp123/640/480/image-%3d.jpg"
#Binary streaming
start cmd.exe /k "ffmpeg -f vfwcap -i 0 -f mpeg1video -b:v 500k -r 21 -q:v 10 -s 640x480 http://127.0.0.1:9082/temp123/640/480/"

# HTTP server
start cmd.exe /k "node server-http.js 8080"