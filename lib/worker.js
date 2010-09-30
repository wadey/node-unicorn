var assert = require('assert');

process.on('uncaughtException', function(err) {
    console.log(err);
});

onmessage = function(msg) {
    assert.ok(msg.fd && msg.fd > 0);
    var server = require(msg.data.file);
    server.listenFD(msg.fd);
    console.log("Worker spawned (pid: " + process.pid + ")");
};
