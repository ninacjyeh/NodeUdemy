/*
製作一個隨機獲取狗狗品種圖片的功能
 */

const fs = require('fs');
const superagent = require('superagent');

// // 以下注意callback hell
// fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
//     console.log(`Breed: ${data}`);

//     superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .end((err, res) => {
//         if (err) return console.log(err.message); //此處使用return可以讓err log留存外，不影響程式運行
//         console.log(res.body.message);

//         //save res body message
//         fs.writeFile('dog-img.txt', res.body.message, err => {
//             if (err) return console.log(err.message);
//             console.log('random dog img saved to txt.');
//         });
//     });
// });

// Solving callback hell from promises
const readFilePro = file => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if (err) reject ('It could not find that file!');
            resolve(data);
        });
    });
};

const writeFile = (file, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, err => {
            if (err) reject('Could not write file!');
            resolve('success');
        });
    });
};

// readFilePro(`${__dirname}/dog.txt`)
// .then(data => {
//     console.log(`Breed: ${data}`);
//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
// })
// .then(res => {
//     console.log(res.body.message);
//     return writeFile('dog-img.txt', res.body.message,);
// })
// .then (() => {
//     console.log('random dog img saved to file.');
// })
// .catch(err => {
//     console.log(err.message);
// });

// // async/await method
// const getDogPic = async () => {
//     try {
//         const data = await readFilePro(`${__dirname}/dog.txt`);
//         console.log(`Breed: ${data}`);

//         const res = await superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//         console.log(res.body.message);

//         await writeFile('dog-img.txt', res.body.message);
//         console.log('random dog img saved to file.');

//         return 'Dog picture fetched and saved successfully!';
//     } catch (err) {
//         console.log(err);
//         throw err;  // 向外拋出錯誤
//     } finally {
//         return '2: ready';
//     }
// };

// (async() => {
//     try {
//         console.log('1: will get dog pics');
//         const x = await getDogPic();
//         console.log(x);
//         console.log('3: done getting dog pics');
//     } catch (err) {
//         console.log('error!!');
//     }
// })();  //在定義函數之後加上 ()，這樣函數會被立即執行，而不僅僅是定義。


// async/await method >>多個api
const getDogPic = async () => {
    try {
        const data = await readFilePro(`${__dirname}/dog.txt`);
        console.log(`Breed: ${data}`);

        const res1Pro = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        
        const res2Pro = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        
        const res3Pro = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        
        const all = await Promise.all ([res1Pro, res2Pro, res3Pro]);
        const imgsms = all.map(el => el.body.message);
        console.log(imgsms);

        await writeFile('dog-img.txt', imgsms.join('\n'));
        console.log('random dog img saved to file.');

        return 'Dog picture fetched and saved successfully!';
    } catch (err) {
        console.log(err);
        throw err;  // 向外拋出錯誤
    } finally {
        return '2: ready';
    }
};

(async() => {
    try {
        console.log('1: will get dog pics');
        const x = await getDogPic();
        console.log(x);
        console.log('3: done getting dog pics');
    } catch (err) {
        console.log('error!!');
    }
})();  //在定義函數之後加上 ()，這樣函數會被立即執行，而不僅僅是定義。
