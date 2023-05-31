const http = require('http');
const url = require('url');

const proxy = http.createServer((req, res) => {
    const request = url.parse(req.url);
    const options = {
        host:    request.hostname,
        port:    request.port || 80,
        path:    request.path,
        method:  req.method,
        headers: req.headers,
    };

    console.log(`${options.method} http://${options.host}${options.path}`);
    const backend_req = http.request(options, (backend_res) => {
        res.writeHead(backend_res.statusCode, backend_res.headers);
        backend_res.on('data', (chunk) => {
            res.write(chunk);
        });
        backend_res.on('end', () => {
            res.end();
        });
    });

    req.on('data', (chunk) => {
        backend_req.write(chunk);
    });

    req.on('end', () => {
        backend_req.end();
    });

});

proxy.listen(8080);