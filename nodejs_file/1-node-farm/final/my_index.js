const fs = require('fs'); // fs: filesystem
const http = require('http'); // web server
const url = require('url'); // routing
const slugify = require('slugify');
// 自製模組
const replaceTemplate = require('./modules/replaceTemplate');

///////////////////////////////
// FILES

// // Blocking, synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);∏
// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File written!');

// // Non-blocking, asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => { // callback
//     if (err) return console.log('Error!'); 
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => { // callback
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => { // callback
//             console.log(data3);

//             fs.writeFile('./txt/final.txt', `${data2}\n ${data3}`, 'utf-8', err => {
//                 console.log('Your file has been written!')
//             })
//         });
//     });
// });
// console.log('will read file!'); 

//////////////////////////////
// 移到另一個js檔 >> modules
// const replaceTemplate = (temp, product) => {
//     let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName); // /{%xxx%}/g 表示全局的，才不會只替換了第一個變數
//     output = output.replace(/{%ID%}/g, product.id);
//     output = output.replace(/{%IMAGE%}/g, product.image); // 使用let定義變數，後續可進行變數修改
//     output = output.replace(/{%FROM%}/g, product.from);
//     output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
//     output = output.replace(/{%QUANTITY%}/g, product.quantity);
//     output = output.replace(/{%PRICE%}/g, product.price);
//     output = output.replace(/{%DESCRIPTION%}/g, product.description);
    
//     if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
//     // output = output.replace(/{%ORGANIC%}/g, product.organic); 在json中使用bool去定義，將顯示內容顯在html中，若false才置換內容
//     return output;
// }
    
// 將讀取資料動作拉出callback function之外，因為只讀取一次，基本上不會導致阻塞，可以使用sync
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');  // './' 表示腳運運行的位置； __dirname 表示當前文件所在的位置
const dataObj = JSON.parse(data); // data是一串字串，使用JSON轉換成json格式
// 訂製url name
const slugs = dataObj.map(el => slugify(el.productName, {lower : true}));
console.log(slugs);

// SERVER
// ROUTING  (F12 - 檢視網頁內容)
const server = http.createServer((req, res) => {  // callback function
    //console.log(req.url);
    //res.end('Hello From the server!')
    
    // console.log(req.url);
    // console.log(url.parse(req.url, true)); // 從url解析出變量
    // 實踐routing
    // const pathName = req.url;
    const { query, pathname } = url.parse(req.url, true);

    // Overview page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Contain-type': 'text/html' });

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join(''); //將文字串起來成一段
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

        res.end(output);
        
    // Product page∏
    } else if (pathname === '/product') {
        res.writeHead(200, { 'Contain-type': 'text/html' });
        const product = dataObj[query.id]; // query 用法
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
    // API
    } else if (pathname === '/api') {
        res.writeHead(200, { 'Contain-type': 'application/json' }); // for json
        res.end(data); // 輸入先前已經讀取的資料
    // NOt found
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html', // for html
            'my-own-header': 'hello-world'
        });
        res.end('<h1> Page not found! </h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000'); // 127.0.0.1 default local host / 8000 is port
})