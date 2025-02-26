import express from "express";
import videoRouter from "./video.router.js";
import carRouter from "./car.router.js";
import authRouter from "./auth.router.js";
import roleRouter from "./role.router.js";
import permissionRouter from "./permisstion.router.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../common/swagger/init.swagger.js";
import chatRouter from "./chat.router.js";
import userRouter from "./use.router.js";
const rootRouter = express.Router();

rootRouter.use("/api-docs", swaggerUi.serve);
rootRouter.get("/api-docs", (req, res) => {
  const urlNew = `${req.protocol}://${req.get(`host`)}`;

  console.log({ urlNew });

  const isUrl = swaggerDocument.servers.find((item) => {
    const isFind = item.url === urlNew;
    return isFind;
  });
  if (!isUrl) {
    swaggerDocument.servers.unshift({
      url: urlNew,
      description: "Server đang online",
    });
  }

  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: { persistAuthorization: true },
  })(req, res);
}); //  thêm {swaggerOptions: { persistAuthorization: true }, } để khi F5 lại trang swagger vẫy lưu token

rootRouter.get(`/`, (req, res, next) => {
  res.json(`ok`);
});

rootRouter.use(`/video`, videoRouter);
rootRouter.use(`/car`, carRouter);
rootRouter.use(`/auth`, authRouter);
rootRouter.use(`/role`, roleRouter);
rootRouter.use(`/permission`, permissionRouter);
rootRouter.use(`/chat`, chatRouter);
rootRouter.use(`/user`, userRouter);

export default rootRouter;
