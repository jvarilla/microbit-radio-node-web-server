/*
	Listens for a request for a file from the file server
	On a request it make a serial write to microbit
	which sends a request via radio to the fileServer program
*/

const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const http = require('http');
var fs = require('fs');
var path = require('path');
let port;

const portName = process.argv[2];
try {
	port = new SerialPort(portName, { baudRate: 115200 })
} catch(err) {
	console.log("Could Not Connect To Port\nCheck the port name");
}

const parser = new Readline()
console.log(process.argv);
process.stdin.pipe(port);
port.pipe(parser)

parser.on('data', line => console.log(`> ${line}`));
//port.on('data', line => port.write(line));

/* MICROBIT'S Serial Port can read/write 
	10 characters at a time
*/

//port.write("Hi");
//> ROBOT ONLINE

http.createServer(function (request, response) {
    console.log('request ', request.url);

    var filePath = '.' + request.url;
    if (filePath == './') {
        filePath = './index.html';
    }

    var extname = String(path.extname(filePath)).toLowerCase();
    var mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.txt': 'text/plain'
    };

    var contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT') {
                fs.readFile('./404.html', function(error, content) {
                    response.writeHead(404, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                response.end();
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });

}).listen(3000);


// Send a string over radio to the other microbit via serial
function sendStringOverRadio() {

}
console.log('Server running at http://127.0.0.1:3000/');