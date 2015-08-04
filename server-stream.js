var ws = require('ws');

if( process.argv.length < 3 ) {
	console.log(
		'Usage: \n' +
		'node stream-server.js <secret> [<stream-port> <websocket-port> <base64>]'
	);
	process.exit();
}

var STREAM_SECRET = process.argv[2],
	STREAM_PORT = process.argv[3] || 8082,
	WEBSOCKET_PORT = process.argv[4] || 8084,
    STREAM_FORMAT = process.argv[5] || 'binary',
	STREAM_MAGIC_BYTES = 'jsmp'; // Must be 4 bytes

var width = 320,
	height = 240;

// Websocket Server
var socketServer = new (ws.Server)({port: WEBSOCKET_PORT});
socketServer.on('connection', function(socket) {
	// Send magic bytes and video size to the newly connected socket
	// struct { char magic[4]; unsigned short width, height;}
	var streamHeader = new Buffer(8);
	streamHeader.write(STREAM_MAGIC_BYTES);
	streamHeader.writeUInt16BE(width, 4);
	streamHeader.writeUInt16BE(height, 6);
	socket.send(streamHeader, {binary:true});

	console.log( 'New WebSocket Connection ('+socketServer.clients.length+' total)' );
	
	socket.on('close', function(code, message){
		console.log( 'Disconnected WebSocket ('+socketServer.clients.length+' total)' );
	});
});

socketServer.broadcast = function(data, opts) {
	for( var i in this.clients ) {
		if (this.clients[i].readyState == 1) {
            if('base64' == STREAM_FORMAT) {
                this.clients[i].send('data:image/jpeg;base64,' + data.toString('base64'), opts);
            }else{
                this.clients[i].send(data, opts);
            }
		}
		else {
			console.log( 'Error: Client ('+i+') not connected.' );
		}
	}
};


// HTTP Server to accept incomming MPEG Stream
var streamServer = require('http').createServer( function(request, response) {
	var params = request.url.substr(1).split('/');

	if( params[0] == STREAM_SECRET ) {
		width = (params[1] || 320)|0;
		height = (params[2] || 240)|0;

        // broadcast data in base64 format
        if('base64' == STREAM_FORMAT) {

            var data = [], dataLen = 0;

            request.on('data', function (chunk) {
                data.push(chunk);
                dataLen += chunk.length;
            });

            request.on('end', function (chunk) {

                var buf = new Buffer(dataLen);
                for (var i = 0, len = data.length, pos = 0; i < len; i++) {
                    data[i].copy(buf, pos);
                    pos += data[i].length;
                }

                socketServer.broadcast(buf, {binary: false});

            });

        // broadcast data in binary format
        }else{

            console.log(
                    'Stream Connected: ' + request.socket.remoteAddress +
                    ':' + request.socket.remotePort + ' size: ' + width + 'x' + height
            );

            request.on('data', function(date) {

                socketServer.broadcast(date, {binary: true});

            });

        }

	}else {
		console.log(
			'Failed Stream Connection: '+ request.socket.remoteAddress + 
			request.socket.remotePort + ' - wrong secret.'
		);
		response.end();
	}

}).listen(STREAM_PORT);

console.log('Listening for MPEG Stream on http://127.0.0.1:'+STREAM_PORT+'/<secret>/<width>/<height>');
console.log('Awaiting WebSocket connections on ws://127.0.0.1:'+WEBSOCKET_PORT+'/');