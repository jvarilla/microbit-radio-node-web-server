const { Transform } = require('stream')
const debug = require('debug')('serialport/micro-radio-internet')

/**
 * A transform stream that does something pretty cool.
 * @extends Transform
 * @param {Object} options parser options object
 * @example
// To use the `MicroRadioInternet` stream:
const MicroRadioInternet = require('micro-radio-internet')
const microRadioInternet = new MicroRadioInternet()
microRadioInternet.on('data', console.log)
microRadioInternet.write(Buffer.from([1,2,3]))
*/
class MicroRadioInternet extends Transform {
  constructor (options) {
    super(options)
    debug('New Object Created')
    // your code here
  }
}

module.exports = MicroRadioInternet
