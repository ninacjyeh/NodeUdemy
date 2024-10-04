const express = require("express");
const morgan = require("morgan");
const app = express();

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

app.use(express.json()); //中間件
app.use(morgan("dev")); //middle ware logger
app.use((req, res, next) => {
  console.log("Hello from the middleware");
  next(); //使用next function
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
