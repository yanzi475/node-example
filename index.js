const server = require('./src/server'),
      router = require('./src/router');

server.start(router);