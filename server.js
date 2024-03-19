const http = require('http');
const url = require('url');
const fs = require('fs')


const server = http.createServer((req, res) => {

    if (req.method === 'GET') {
        let filePath = req.url.substring(1)

        if (filePath === '')
            filePath = 'index.html';

        fs.readFile('data/' + filePath, (error, data) => {
            if (error) {
                res.statusCode = 404;
                res.end(error.message)
            }
            else {
                res.end(data);
            }
        });



    } else if (req.method === 'POST' && req.url === '/cart') {

        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });

        req.on('end', () => {
            const dataObj = JSON.parse(data)
            console.log(dataObj)
            res.statusCode = 200;
            res.end('ОК')
        })

    }

})

server.listen(3000, () => {
    console.log('server start on port 3000')

})
