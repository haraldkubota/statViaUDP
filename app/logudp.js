
/*
Format of incoming UDP messages:

APP_NAME ID [START|END|ERROR|LOG FREE TEXT] EOL

APP_NAME is a unique applicatio name. This is the index to count on
ID is an ID unique for the processing (used to identify START and END which belong together)
START: Start processing of id ID
END: End processing of id ID
ERROR: Error processing of id ID
LOG: Message (for debugging)

EOL is \r or \n or \r\n

Potential problem:
DOS attack: send a lot of START and never END -> memory usage will increase.
Solution: expiration timer and periodic cleanup or max. limit of outstanding requests

*/


String.prototype.chomp = function() {
	return this.replace(/(\n|\r)+$/, '');
}


function printError(msg) {
	console.error(`${(new Date()).toISOString()} ERR: ${msg}`)
}


var inFlight=[];

function logViaUDP(msg, rinfo) {
  let args = msg.toString().chomp().split(' ');
  let app, id, cmd;
  [app, id, cmd] = args.splice(0,3);
  let log = args.join(' ');

  /*
  let lograw={
  	start: Date.now(),
  	from: rinfo.address,
  	app: app,
  	id: id,
  	cmd: cmd,
  	log: log
  	};
  console.log(lograw);
  */
  let appid = app + '_' + id;

  switch(cmd) {
  	case 'START':
  		if (typeof inFlight[appid] != 'undefined') {
  			printError(`Received another ${cmd} (app=${app}, id=${id}, from=${rinfo.address})`);
  		}
  		inFlight[appid] = {
  			start: Date.now(),
  			from: rinfo.address,
  			app: app
 			};
		break;
	case 'LOG':
		if (typeof inFlight[appid] == 'undefined') {
  			printError(`Received ${cmd} without START (app=${app}, id=${id}, from=${rinfo.address})`);
		} else {
			if (typeof inFlight[appid].log == 'undefined') {
				inFlight[appid].log = [];
			}
			inFlight[appid].log.push(Date.now() - inFlight[appid].start + "ms " + log.chomp());	
		}
		break;
	case 'END':
	case 'ERROR':
		if (typeof inFlight[appid] == 'undefined') {
  			printError(`Received ${cmd} without START (app=${app}, id=${id}, from=${rinfo.address})`);
		} else {
			inFlight[appid].duration = Date.now() - inFlight[appid].start;
			inFlight[appid].status = (cmd == 'END') ? 'OK' : 'ERROR';
			console.log("Send to ElasticSearch:", inFlight[appid]);
			delete inFlight[appid];
		}
		break;
	default:
		printError(`Received unknown command ${cmd} (app=${app}, id=${id}, from=${rinfo.address})`);
  	}
  }

module.exports={
	logViaUDP: logViaUDP
}
