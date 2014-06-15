var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');

var Gpio = require('onoff').Gpio,  // Constructor function for Gpio objects.
	buttonID = 23,
	tt = [0, 0],  // the current timestamp
	bounceTime = 1 * 1e9;  // if button is pressed twice within a second => ignore it (nanoseconds)
	button = new Gpio(buttonID, 'in', 'falling'); // Export GPIO #23 as an interrupt

console.log('Please press the button on GPIO #'+ buttonID +'...');




function exit() {
	console.log("Doing Exit stuff...");
	button.unexport();
	process.exit();
}
process.on('SIGINT', exit);

app.listen(8888);


function handler (req, res) {
  fs.readFile(__dirname + '/index.html', function (err, data) {
	if (err) {
		res.writeHead(500);
		return res.end('Error loading index.html');
	}

	res.writeHead(200);
	res.end(data);
  });
}

io.on('connection', function(socket) {
    button.watch(function(err, value) {
        if (err) throw err;
        var diff = process.hrtime(tt);
        var diffNano = diff[0] * 1e9 + diff[1];
        if (diffNano > bounceTime) {
            tt = process.hrtime();
            console.log('Button pressed!, time: ' + tt + ', diff: ' + diff);
            console.log("Sending socket message!");
            socket.emit('importantMsg', {
                msg: 'OMG IT WWORKS!'
            });

        } else {
            console.log("Bouncy bounce");
        }
    });
});

