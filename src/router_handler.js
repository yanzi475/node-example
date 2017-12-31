const fs = require('fs');

function errorHandle(err, res) {
    if (err instanceof Error) {
        res.end(err.message);
    } else if (typeof err === 'string') {
        res.end(err);
    } else {
        res.writeHead(500);
        res.end('server error!');
    }
}

function upload(req, res) {

    res.end('upload');
}

function start(req, res) {
    fs.readFile('html/upload.html', (err, data) => {
        if (err) {
            return errorHandle(err, res);
        }
        res.end(data);
    })
}

exports.start = start;
exports.upload = upload;