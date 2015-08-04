# Video live streaming in html5

This tutorial describes how display video data in real-time on the canvas object in html5. 
Date are broadcast by web socket to html5 in two different ways:

- FFmpeg convert stream data to images which are sent to server. The server merge images data and convert binary to base64, 
then broadcast full image in string/base64 format by web socket. The javascript refresh images on canvas object. 
- Binary data are sent to server which broadcast blob object by web socket. 
The library [jsmpeg](https://www.ffmpeg.org/download.html) allows render this type of data on canvas object.     
  
This solution allows only broadcast video without audio.

# I.  Requirements:

Tools and nodejs libraries which was used in this tutorial.

a) Tools

- [nodejs](https://nodejs.org/download/)
- [Python](https://www.python.org/downloads/release/python-343/)
- [FFmpeg](https://www.ffmpeg.org/download.html)

b) nodejs library

The below libraries you have to install in your project folder

```bash
$ npm install ws
```

```bash
$ npm install express
```

# II. Web socket server

Run stream server in nodejs which allow broadcast data by web socket.
The parameter `base64` is optional and allow broadcast data in base64 format.
Without parameter `base64` data are sent in binary format.

```bash
$ node server-stream.js [your_password] [http_port] [ws_port] [base64]
```

```bash
$ node server-stream.js pass123 8082 8084 base64
```

# III. Command FFmpeg:

## 1. Windows

FFmpeg commands use in Windows

### a) Streaming from PC camera

image streaming

```bash
$ ffmpeg -f vfwcap -i 0 -f image2 -vcodec mjpeg -b:v 500k -r 21 -q:v 10 -s 640x480 http://127.0.0.1:8082/temp123/640/480/image-%3d.jpg
```

binary streaming

```bash
$ ffmpeg -f vfwcap -i 0 -f mpeg1video -b:v 500k -r 21 -q:v 10 -s 640x480 http://127.0.0.1:8082/temp123/640/480/
```

### b) Streaming from rtmp protocol

image streaming

```bash
$ ffmpeg -i "rtmp://127.0.0.1/video_audio live=1" -f image2 -vcodec mjpeg -b:v 500k -r 21 -q:v 10 -s 640x480 http://127.0.0.1:8082/temp123/640/480/image-%3d.jpg
```

binary streaming

```bash
$ ffmpeg -i "rtmp://127.0.0.1/video_audio live=1" -f mpeg1video -b:v 500k -r 21 -q:v 10 -s 640x480 http://127.0.0.1:8082/temp123/640/480/
```

## 2. Unix/Linux

FFmpeg commands use in Unix/Linux

`TODO`

# IV. HTTP Server

Run http server based on express in nodejs

```bash
$ node server-http.js [http_port] 
```

Following you can find example client implementation 

```
http://127.0.0.1:8080/stream-base64.html 
```

```
http://127.0.0.1:8080/stream-jsmpeg.html 
```
