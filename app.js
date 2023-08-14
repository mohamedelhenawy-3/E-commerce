const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const errorHandler = require("./middlware/globalMiddlware");
const errorResponse = require("./utils/errResponse");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use("/api/user", require("./routes/userRoute"));
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/product", require("./routes/productRoute"));
// app.use("/api/blog", require("./routes/blogRoute"));
app.use("/api/productCategory", require("./routes/productCatRoute"));
// app.use("/api/blogCategory", require("./routes/blogCatRoute"));
app.use("/api/coupon", require("./routes/couponRouter"));
app.all("*", (req, res, next) => {
  next(new errorResponse(`Cant find this Route ::${req.originalUrl}`, 400));
});
app.use(errorHandler);
const url =
  "mongodb+srv://max:10112000@cluster0.xdpxd.mongodb.net/E-commerce?retryWrites=true&w=majority";
const port = 2001;
mongoose
  .connect(url, {})
  .then((result) => {
    console.log("database connected");
  })
  .catch((err) => {
    console.log(err);
  });
app.listen(port, () => {
  console.log(`the sever run in ${port}`);
});
