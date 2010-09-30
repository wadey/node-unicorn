var assert = require('assert');

process.on('uncaughtException', function(err) {
    console.log(err);
});

function shutdown(server) {
    server.close();

    // TODO: Is some way to listen for this as an event?
    setInterval(function() {
        if (server.connections == 0) {
          process.exit();
        }
    }, 100);
}

var server;
onmessage = function(msg) {
    if (msg.data.exit) {
        shutdown(server);
    } else if (msg.fd) {
        server = require(msg.data.file);
        server.listenFD(msg.fd);
        console.log("Worker spawned (pid: " + process.pid + ")");
    } else {
        console.log("Unexpected message: ", msg);
    }
};
