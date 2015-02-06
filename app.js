var express = require('express');

var router = express();
var http = require('http');
var socketio = require('socket.io');
var server = http.createServer(router);
var io = socketio.listen(server);
var exec = require('child_process').exec;
var gpio = require('pi-gpio');
var path = require('path');
var querystring = require("querystring");
var url = require('url');

router.use(express.static(__dirname + "/public"));
router.use('/bower_components', express.static(__dirname + '/bower_components'));

router.get('/', function(req, res) {
  res.sendFile(__dirname + "/plik.html");
});

var currentTemperature = 0.0;

var tempId = '28-000006c01dc8',
    dispTempInterval,
    dispTempIntervalClock = 2; //sec
 
var dispTemp = function(SOCKET_TYPE){
    exec( "cat /sys/bus/w1/devices/" + tempId + "/w1_slave | grep t= | cut -f2 -d= | awk '{print $1/1000}'", function( error, stdout, stderr ){
        if ( error != null ){
          console.log( "Error: " + error);
        }
 
        var temp = parseFloat(stdout).toFixed(2);
        if (temp !== currentTemperature) {
            currentTemperature = temp;
        	  SOCKET_TYPE.emit('update temperature', temp);
        }
    });
}
 
console.log( 'Modul dallas uruchomiony');
console.log( '-----------------');


// Serve files
router.get('', function(request, response){
  response.sendFile('rooms.html', { root: path.join(__dirname, 'views')});
}); 
 
router.get("/send", function(request, response){
    
    // Get data
    var queryData = url.parse(request.url, true).query;
    console.log("State " + queryData.state + " received.");

    // Apply command
    if (queryData.state == 'on') {
      gpio.open(12, "output", function(err) {     
        gpio.write(12, 1, function() {  
            gpio.close(12);                   
        });
    });
    }
    if (queryData.state == 'off') {
    gpio.open(12, "output", function(err) {     
        gpio.write(12, 0, function() {  
            gpio.close(12);                   
        });
    });
    } 
    
    // Answer
    response.writeHead(200, {"Content-Type": "text/html"});
    response.end();
}); 
 
/* Start interval */

io.on('connection', function(socket) {
  dispTemp(socket);
});

dispTempInterval = setInterval( function(){
  dispTemp(io.sockets);
}, dispTempIntervalClock*1000 );



server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("listening at", addr.address + ":" + addr.port);


});




