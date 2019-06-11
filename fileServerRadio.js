/*
	Listens for a over radio via serial for a file
    Sends back the contents of the file over serial
    to be transmitted via radio
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

let listeningForFilePath = false;
let isLookingForAFile = false;
let filePath = "";
let fileContents = "";
let finishedSendingFileContents = false;
// port.pipe(process.stdout);
parser.on('data', (line) => {
    console.log(`> ${line}`);
    // When receive the GET# command set is looking forAFile to true
    if (line.trim() == "#GET#") {
        console.log("LISTENING");
        let msg = "\nLISTENING\n"
        port.write(msg);
        listeningForFilePath = true;
        // Reset File Path
        filePath = "";
        return;
    } else if (listeningForFilePath) {
        if (line.trim() == "#END#") { // If the End Comand is found stop listening for file path
            listeningForFilePath = false;
            let msg = "\nSEARCHING\n"
            port.write(msg);
            // Reset the file contents
            fileContents = "";

            // Look for File and send it over serial
            lookForFileAndSendOverSerial(filePath);
            return;
        } else { // Build the file path string
            console.log("building file");
            filePath += line.trim();
            console.log(filePath)
        }
    }
});

function lookForFileAndSendOverSerial(pathToFile) {
    console.log("Fetching pathToFile");
    pathToFile = "." + pathToFile;
     fs.readFile(pathToFile, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT') {
                fs.readFile('./404.html', function(error, content) {
                    // Make file contents not found
                    console.log("File NOT Found");
                    fileContents = "NOT FOUND";
                });
            }
            else {
                // Make file contents an error string
                console.log("ERROR FILE");
                fileContents = "ERROR";
            }
        }
        else {
            // Otherwise make the fle contents equal to the contents
            fileContents = content.toString();
            console.log(fileContents);
        }

        // Write The file to serial
            const BUFFER_CHAR_LIMIT = 11;
            let idx = 1;
            port.open(function() {
                 for (let cIdx = 0; cIdx < fileContents.length; cIdx+=BUFFER_CHAR_LIMIT) {
                // Limit the sends to 10 characters
                let upperBoundLimit = cIdx + BUFFER_CHAR_LIMIT;
                // If the upperBoundLimit is greater than the length make it equal to length
                if (upperBoundLimit > fileContents.length) {
                    upperBoundLimit = fileContents.length;
                }

                let lineToSend = "\n" + fileContents.substring(cIdx, upperBoundLimit) + "\n";
                
                
                //port.write(`\n${lineToSend}\n`);
                //console.log(lineToSend + "\n");
                setTimeout(function() {
                    port.write(lineToSend);
                    console.log(`\n${lineToSend}`);
                }, 500 * idx);
                idx++;
            }
            // Send the #DONE# command over serial
            setTimeout(function() {
                    port.write("\n#DONE#\n");
                }, 500 * idx);
            
            console.log("\n" + `#DONE#`+ "\n");
    
        })

    });

}

//port.on('data', line => port.write(line));

/* MICROBIT'S Serial Port can read/write 
	10 characters at a time
*/

//port.write("Hi");
//> ROBOT ONLINE
