const fs = require("fs");
const crypto = require("crypto");

const start = Date.now()
// node default 4 thread pools, 以下可以調整thread pool個數
process.env.UV_THREADPOOL_SIZE = 4;

// Event Loop
setTimeout(() => {
    console.log("Timer 1 finished"), 0
});
setImmediate(() => {
    console.log("Immediate 1 finished")
});
// 當箭頭函數內有多行代碼或你想明確表示程式塊時，使用大括號 {}。這樣可以定義多行程式語句。
// 當箭頭函數內只有一行程式代碼時，可以省略大括號 {}，並且這行代碼會自動被作為返回值。

fs.readFile("test-file.txt", () => {
    console.log("I/O finished");
    console.log("---------------------");

    setTimeout(() => console.log("Timer 2 finished"), 0);
    setTimeout(() => console.log("Timer 3 finished"), 3000);
    setImmediate(() => console.log("Immediate 2 finished"));

    process.nextTick(() => console.log("Process.nextTick"));

    crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
        console.log(Date.now() - start, "Password encrypted");
    });
    crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
        console.log(Date.now() - start, "Password encrypted");
    });
    crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
        console.log(Date.now() - start, "Password encrypted");
    });
    crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
        console.log(Date.now() - start, "Password encrypted");
    });

});

// Top-level
console.log("Hello from the top-level code");