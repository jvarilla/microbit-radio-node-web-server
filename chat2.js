const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
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