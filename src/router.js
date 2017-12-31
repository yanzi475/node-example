const http = require('http'),
      url = require('url'),
    router_handler = require('./router_handler'),
      child_process = require('child_process');

let handlers = {
    '/': router_handler.start,
    '/upload': router_handler.upload
};

function route(req, res) {
    let pathname = url.parse(req.url).pathname;
    console.log('pathname:' + pathname);
    if (typeof handlers[pathname] === 'function') {
        handlers[pathname](req, res);
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end(pathname + ' ' + http.STATUS_CODES[404]);
    }
}

exports.route = route;