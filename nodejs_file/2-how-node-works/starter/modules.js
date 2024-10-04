// console.log(arguments);
// console.log( require('module').wrapper);

// module.export
const C = require('./test-module-1')
const calc1 = new C();
console.log(calc1.add(10,5));

// export
const calc2 = require('./test-module-2')
console.log(calc2.add(10,5));

// export ：直接使用module function name
const {add, multiply, divide} = require('./test-module-2')
console.log(add(10,5));

// caching
require('./test-module-3')();
require('./test-module-3')();
require('./test-module-3')();