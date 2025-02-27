import express from "express";
import { handleError } from "./src/common/helpers/error.helper.js";
import rootRouter from "./src/routers/root.router.js";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import prisma from "./src/common/prisma/init.prisma.js";
import io from "./src/common/socket/init.socket.js";
import initSocket from "./src/common/socket/init.socket.js";
// node js là gì:để chạy được code trên máy tính mà kh phụ thuộc vào chrome (node)

const app = express();
app.use(express.json()); // Middleware giúp phân giải đối tượng json sang đối tượng js
app.use(
  cors({
    origin: ["http://localhost:5173", "google.com"],
  })
);
app.use(express.static("."));

app.use(rootRouter);
app.use(handleError);

const httpServer = createServer(app);

initSocket(httpServer);

httpServer.listen(3069, () => {
  console.log(`Server online at port 3069`);
});

/**
 * tự động lưu token ở POSTMAN
 * const response = pm.response.json()



if(response.status === `error`) return

const accessToken = response.metaData.accessToken
const refreshToken = response.metaData.refreshToken

pm.collectionVariables.set("accessToken", accessToken);
pm.collectionVariables.set("refreshToken", refreshToken);

 */

/**
 * các thư viện cần cài đặt
 * Prisma
 * prisma client
 *
 * lệnh chạy:
 * npx prisma init: khởi tạo prima
 *    -tạo ra .env
 *    -tạo ra prima/schema.prima
 * npx prisma db pull
 *   - kéo dữ liệu từ data base về
 * npx prisma generate
 *
 * ****** cặp nhập lại bd
 *    npx prisma db pull
 *    ./
 */

// app.use(
//   (req, res, next) => {
//     console.log("middleware1");
//     const payload = "payload";
//     req.payload = payload; // thêm payload vào req
//     next();
//   },
//   (req, res, next) => {
//     console.log("middleware2");
//     console.log(req.payload);
//     next(123);
//   },
//   (req, res, next) => {
//     console.log("middleware3");
//     next();
//   }
// );
/**
 * Database first
 * Đi từ câu lệnh tạo ra table 
 *    - tạo ra  table bằng câu lệnh SQL
 *    - sequelize-auto
 *    - npm - sequelize-auto
 * npx sequelize-auto -h localhost -d lt_be_cyber_media -u root -x 1234 -p 3307  --dialect mysql -o src/models  -a src/models/additional.json


*/

// /**
//  * Query parameters
//  * Query thường dùng để phân trang, search, filter
//  */

// app.get(`/query`, (req, res, next) => {
//   const { email, password } = req.query;
//   console.log(email, password);
//   console.log(req.query);
//   res.json(`Query parameters`);
// });

// /**
//  * Path Parameters
//  * Thường dùng: khi muốn lấy chi tiết (detail) của 1 user, product, ...
//  */

// app.get(`/path/:id`, (req, res, next) => {
//   console.log(req.params);
//   res.json(`Path parameters`);
// });

// /**
//  * Header
//  */
// app.get(`/headers`, (req, res, next) => {
//   console.log(req.headers);
//   res.json(`Headers parameters`);
// });

// /**
//  * Body
//  * Để nhận được dữ liệu từ body bắc buộc phải có
//  * app.use(express.json());
//  * hoặc từ thư viện parder: https://www.npmjs.com/package/body-parser
//  *
//  */
// app.post(`/body`, (req, res, next) => {
//   console.log(req.body);
//   res.json(`Body parameters`);
// });
