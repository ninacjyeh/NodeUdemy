const EventEmitter = require("events");
const http = require("http");

//const myEmitter = new EventEmitter();

// 嘗試使用 ES6 的 class 繼承
/*
	•這裡定義了一個名為 Sales 的類，它繼承了 EventEmitter，使得 Sales 類的實例能夠發送和接收事件。
	•super()：在 ES6 中，當我們繼承某個類時，必須在子類的構造函數中調用 super()，以便正確地繼承父類的功能。
    在這裡，super() 調用了 EventEmitter 的構造函數，使得 Sales 類可以使用 EventEmitter 的所有方法（如 emit() 和 on()）。
*/
class Sales extends EventEmitter {
    constructor() {
        super();
    }
}

const myEmitter = new Sales();

myEmitter.on("newSale", () => {
    console.log("There was a new sale!");
});

myEmitter.on("newSale", (name, stock) => {
    console.log(`Customer name: ${name}`);
    console.log(`There are now ${stock} items left in stock.`);
});

myEmitter.emit("newSale", "Nina", 9);

//////////////////

const server = http.createServer();

server.on("request", (req, res) => {
    console.log("Request received");
    console.log(req.url);
    res.end("Request received");
});

server.on("request", (req, res) => {
    console.log("Another request received");
    //res.end("Another request received");
});

server.on("close", () => {
    console.log("Server closed");
});

server.listen(8000, "127.0.0.1", () => {
    console.log("Waiting for request...")
})