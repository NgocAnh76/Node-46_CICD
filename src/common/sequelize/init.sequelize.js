import { Sequelize } from "sequelize";
import initModels from "../../models/init-models.js";
import { DATABASE_URL } from "../constant/app.constant.js";

export const sequelize = new Sequelize(DATABASE_URL, { logging: false });
// kiểm tra kết nối với cơ sở dữ liệu (db)
sequelize
  .authenticate()
  .then(() => {
    console.log(`Kết nối với db thành công`);
  })
  .catch(() => {
    console.log(`Kết nối với bd thất bại`);
  });

const models = initModels(sequelize);
export default models;
