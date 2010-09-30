var path = require('path'),
    Worker = require('webworker').Worker;

exports.start = function(serverFile, port, count) {
  var netBindings = process.binding('net');
  var fd = netBindings.socket('tcp4');
  netBindings.bind(fd, port);
  netBindings.listen(fd, 128);

  console.log("Listening on http://0.0.0.0:" + port);
  for (var i = 0; i < count; i++) {
      var w = new Worker(path.join(__dirname, 'worker.js'));
      w.postMessage({file: path.join(process.cwd(), serverFile) }, fd);
  }
}
