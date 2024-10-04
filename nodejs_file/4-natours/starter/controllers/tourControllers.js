const fs = require("fs");

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
);

exports.checkID = (req, res, next, val) => {
  const id = req.params.id * 1; // 將 ID 轉換為數字
  const tourIndex = tours.findIndex((el) => el.id === id); // 查找該 ID 的索引
  console.log(`Tour id is ${val}`);

  if (tourIndex === -1) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  next();
};

exports.getALLTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: "success",
    requestedAt: "req.requestTime",
    result: tours.length,
    //放進變數tours
    data: tours,
  });
};

exports.getTour = (req, res) => {
  console.log(req.params);
  console.log(req.requestTime);
  const id = req.params.id * 1; //* 1 是一種將從 URL 參數中獲取的字串轉換為數字的方法
  //這裡的 req.params.id 是從請求的 URL 中提取的參數，通常它是以字串形式出現的。
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: "success",
    requestedAt: "req.requestTime",
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
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

exports.updateTour = (req, res) => {
  const id = req.params.id * 1; // 將 ID 轉換為數字
  const tourIndex = tours.findIndex((el) => el.id === id); // 查找該 ID 的索引

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

exports.deleteTour = (req, res) => {
  const id = req.params.id * 1; // 將 ID 轉換為數字
  const tourIndex = tours.findIndex((el) => el.id === id); // 查找該 ID 的索引
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
