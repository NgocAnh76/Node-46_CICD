import { responseSuccess } from "../common/helpers/reponse.helper.js";
import authService from "../services/auth.service.js";

const authController = {
  register: async (req, res, next) => {
    try {
      const userNew = await authService.register(req);
      const resData = responseSuccess(userNew, `Register success`, 200);
      res.status(resData.code).json(resData);
    } catch (error) {
      next(error);
    }
  },
  login: async (req, res, next) => {
    try {
      const data = await authService.login(req);
      const resData = responseSuccess(data, `Login success`, 200);
      res.status(resData.code).json(resData);
    } catch (error) {
      next(error);
    }
  },
  facebookLogin: async (req, res, next) => {
    try {
      const data = await authService.facebookLogin(req);
      const resData = responseSuccess(data, `Login Successfully`, 200);
      res.status(resData.code).json(resData);
    } catch (error) {
      next(error);
    }
  },
  refreshToken: async (req, res, next) => {
    try {
      const data = await authService.refreshToken(req);
      const resData = responseSuccess(data, `Refresh Token Successfully`, 200);
      res.status(resData.code).json(resData);
    } catch (error) {
      next(error);
    }
  },
  getInfo: async (req, res, next) => {
    try {
      const info = await authService.getInfo(req);
      const resData = responseSuccess(info, ` Get info Successfully`, 200);
      res.status(resData.code).json(resData);
    } catch (error) {
      next(error);
    }
  },
};
export default authController;
