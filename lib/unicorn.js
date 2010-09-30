var path = require('path'),
    Worker = require('webworker').Worker;

var workers = [];

function spawn(file, fd) {
  var w = new Worker(path.join(__dirname, 'worker.js'));

  w.postMessage({file: file }, fd);

  w.onmessage = function(e) {
    console.log('Received message: ' + require('sys').inspect(e));
  }

  w.onexit = function(code, signal) {
    delete workers[workers.indexOf(w)];
    spawn(file, fd);
  }

  workers.push(w);

  return w;
}

exports.start = function(serverFile, port, count) {
  var netBindings = process.binding('net');
  var fd = netBindings.socket('tcp4');
  netBindings.bind(fd, port);
  netBindings.listen(fd, 128);

  console.log("Listening on http://0.0.0.0:" + port);
  for (var i = 0; i < count; i++) {
    spawn(path.join(process.cwd(), serverFile), fd);
  }
}

process.addListener('SIGUSR2', function() {
  console.log("Got SIGUSR2: telling workers to restart");
  workers.forEach(function(w) {
    w.postMessage({exit: true});
  });
});
