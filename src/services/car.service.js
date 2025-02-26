import Cars from "../models/Cars.model.js";

const carService = {
  carList: async (req) => {
    // controllable error (400, 401,403)
    // const passUI = 123;
    // const passDB = 1235;
    // if (passUI !== passDB) {
    //   throw new BadRequestException(`Mật khẩu không chính xác`);
    // }
    // console.log(abc);
    const { page } = req.query;
    console.log(+page);
    // cách củ
    // const cars = await sequelize.query(`SELECT * FROM cars`);
    const cars = await Cars.findAll({ raw: true });
    return cars;
  },
};
export default carService;
