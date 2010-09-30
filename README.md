# node-unicorn

A Unicorn-like server for nodejs. Uses [Web Workers](http://github.com/pgriess/node-webworker)
(thanks to Peter Griess) instead of preforking.

NOTE: This is just the start of a work in progress. It is currently usable,
but is lacking cool things like relaunching workers on SIG USR2 and killing
workers that are no longer responding.

## Usage

Create a module where the export is an instance of `net.Server` (for example,
the result of a call to `http.createServer`). This module will be `require`d
in each of the workers when they are launched (and relaunched in the future)

## Example

    $ cat server.js
    var http = require('http');

    module.exports = http.createServer(function(req, res) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end("Hello from PID " + process.pid + "\n");
    });
    
    $ node-unicorn -w 4 server.js
    Listening on http://0.0.0.0:8000
    Worker spawned (pid: 19634)
    Worker spawned (pid: 19633)
    Worker spawned (pid: 19635)
    Worker spawned (pid: 19636)

    $ curl 'localhost:8000'
    Hello from PID 19635
