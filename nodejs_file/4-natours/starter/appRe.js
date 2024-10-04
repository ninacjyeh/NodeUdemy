const fs = require("fs");
const express = require("express");
const morgan = require("morgan");
const app = express();
app.use(express.json()); //中間件

// 1.MIDDLEWARES
//定義中間件：global middleware
//他是依序執行
//他套用在"後續"所有route
app.use(morgan('dev')); //middle ware logger
// app.use(morgan('tiny')); //另一種log內容

app.use((req, res, next) => {
  console.log("Hello from the middleware");
  next(); //使用next function
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`),
);

// 2.ROUTE HANDLERS
const getALLTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: "success",
    requestedAt: "req.requestTime",
    result: tours.length,
    //放進變數tours
    data: tours,
  });
};

const getTour = (req, res) => {
  //:x? 是一個可選的參數，? 表示這個參數在請求中可以出現，也可以不出現。
  console.log(req.params);
  console.log(req.requestTime);
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
    requestedAt: "req.requestTime",
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
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
};

const updateTour = (req, res) => {
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
};

const deleteTour = (req, res) => {
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
};

//GET：獲取資源（讀取）
//app.get("/api/v1/tours", getALLTours);
//app.get("/api/v1/tours/:id/:x?", getTour);
//POST：創建新資源（新增）
//app.post("/api/v1/tours", createTour);
//PATCH：部分更新資源
//app.patch("/api/v1/tours/:id", updateTour);
//DELETE：刪除資源
//app.delete("/api/v1/tours/:id", deleteTour);

// 3.DEF ROUTES
//更簡潔的方法
app.route("/api/v1/tours").get(getALLTours).post(createTour);

app
  .route("/api/v1/tours/:id/:x?")
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

// 4.START SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
