require('http').createServer((req, res) => {
    res.write(req.url);
    res.end()
}).listen(5000);