const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const port = new SerialPort("COM9", { baudRate: 115200 })

const parser = new Readline()
process.stdin.pipe(port);
port.pipe(parser)

parser.on('data', line => console.log(`> ${line}`));
port.on('data', line => port.write(line));
//port.write("Hi");
//> ROBOT ONLINE