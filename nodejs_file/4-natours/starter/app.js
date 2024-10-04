const fs = require("fs");
const express = require("express");

const app = express();

app.use(express.json()); //中間件

// app.get('/', (req, res) => {
//     res
//     .status(200)
//     .json({message: 'Hello from the server side', app: 'Natours'});
// });

// app.post('/', (req, res) => {
//     res
//     .send('You can post to this end point');
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`),
);

//GET：獲取資源（讀取）
app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: "success",
    result: tours.length,
    //放進變數tours
    data: tours,
  });
});

app.get("/api/v1/tours/:id/:x?", (req, res) => {
  //:x? 是一個可選的參數，? 表示這個參數在請求中可以出現，也可以不出現。
  console.log(req.params);

  const id = req.params.id * 1; //* 1 是一種將從 URL 參數中獲取的字串轉換為數字的方法
  //這裡的 req.params.id 是從請求的 URL 中提取的參數，通常它是以字串形式出現的。
  const tour = tours.find((el) => el.id === id);

  //if (id > tours.length) {
  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

//POST：創建新資源（新增）
app.post("/api/v1/tours", (req, res) => {
  //console.log(req.body);

  const newID = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newID }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    },
  );
});

//PATCH：部分更新資源
app.patch("/api/v1/tours/:id", (req, res) => {
  const id = req.params.id * 1; // 將 ID 轉換為數字
  const tourIndex = tours.findIndex((el) => el.id === id); // 查找該 ID 的索引

  if (tourIndex === -1) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  // 更新項目的 duration
  if (req.body.duration) {
    tours[tourIndex].duration = req.body.duration; // 將 duration 更新為請求中的值
  }

  // 更新 JSON 檔案
  fs.writeFile("./tours.json", JSON.stringify(tours, null, 2), (err) => {
    if (err) {
      return res.status(500).json({
        status: "fail",
        message: "Could not update the file",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        tour: tours[tourIndex], // 返回更新後的 tour 資訊
      },
    });
  });
});

// //DELETE：刪除資源
app.delete("/api/v1/tours/:id", (req, res) => {
  const id = req.params.id * 1; // 將 ID 轉換為數字
  const tourIndex = tours.findIndex((el) => el.id === id); // 查找該 ID 的索引

  if (tourIndex === -1) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  tours.splice(tourIndex, 1); // 使用索引刪除該項目

  // 更新 JSON 檔案
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours, null, 2),
    (err) => {
      if (err) {
        return res.status(500).json({
          status: "fail",
          message: "Could not update the file",
        });
      }

      res.status(204).json({
        status: "success",
        data: null,
      });
    },
  );
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
