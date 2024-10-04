const fs = require('fs');
const server = require('http').createServer();

server.on('request', (req, res) => {
    // solution 1: 待data完全讀取才會顯示
    // fs.readFile('test-file.txt', (err, data) => {
    //     if (err) console.log(err);
    //     res.end(data);
    // });

    // solution 2: Streams
    // back pressure :當request發送發送數據請求的速度 相等同 文件接收數據的速度，會發生back pressure
    // const readable = fs.createReadStream('test-file.txt');
    // readable.on('data', chunk => {
    //     res.write(chunk);
    // });
    // readable.on('end', () => {
    //     res.end();
    // });
    // readable.on('error', err => {
    //     console.log(err);
    //     res.statusCode = 500;
    //     res.end('File not found!');
    // });
    
    // solution 3: pipe operator: 解決back pressure問題
    const readable = fs.createReadStream('test-file.txt');
    readable.pipe(res);
    // readableSource.pipe(writeableDest)
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening');
});