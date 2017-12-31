const http = require('http');
const process = require('process');


// function start(router) {
//     let server = http.createServer((req, res) => {
//         router.route(req, res);
//     });
//     server.listen(8080);
//     console.log('start server in ' + process.cwd());
// }
//
// exports.start = start;



const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World\n');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});



// 另一种写法
function onRequest(request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello World");
    response.end();
}

http.createServer(onRequest).listen(process.env.PORT);
