var express = require('express');

if( process.argv.length < 3 ) {
    console.log(
            'Usage: \n' +
            'node http-server.js <http-port>'
    );
    process.exit();
}

var PORT = process.argv[2];
var app = express();

app.use(express.static(__dirname + '/public'));

app.listen(PORT, function(){
    console.log('Listening HTTP server on http://127.0.0.1:' + PORT);
});