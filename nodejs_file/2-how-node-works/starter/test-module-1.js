// 寫法一
class Calculator {
     add(a,b) {
        return a+b;
     }
     multiply(a,b) {
        return a*b;
     }
     divide(a,b) {
        return a/b;
     }
}

module.exports = Calculator;

// 寫法二 ：不設定模組名稱
module.exports = class {
   add(a,b) {
      return a+b;
   }
   multiply(a,b) {
      return a*b;
   }
   divide(a,b) {
      return a/b;
   }
}