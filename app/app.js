// Checkpoint and count access to apps
// Those apps do UDP requests

const dgram = require('dgram');
const server = dgram.createSocket('udp4');

const logudp = require('./logudp');


server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('listening', () => {
  var address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});


server.on('message', (msg, rinfo) => {
	logudp.logViaUDP(msg, rinfo)
});

server.bind(Number(process.argv[2]) || 41234);
// server listening 0.0.0.0:41234
