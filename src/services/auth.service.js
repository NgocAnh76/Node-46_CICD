import bcrypt from "bcrypt";
import {
  BadRequestException,
  UnAuthorizationException,
} from "../common/helpers/error.helper.js";
import prisma from "../common/prisma/init.prisma.js";
import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_EXPIRED,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRED,
  REFRESH_TOKEN_SECRET,
} from "../common/constant/app.constant.js";
import sendMail from "../common/nodemailer/send-mail.nodemailer.js";
const authService = {
  register: async (req) => {
    //Bước1: nhận dữ liệu: full_name, email, pass_word
    const { full_name, email, pass_word } = req.body;
    // console.log({ full_name, email, pass_word });
    //Bước2:lấy eamil và kiểm tra trong db xem đã có người dùng đó hay chưa
    const userExists = await prisma.users.findFirst({
      where: {
        email: email,
      },
    });
    // console.log({ userExists });
    if (userExists) {
      throw new BadRequestException("Tài khoản đã tồn tại vui lòng đăng nhập");
    }
    // mã hoá password
    const passHash = bcrypt.hashSync(pass_word, 10);

    //Bước3: tạo người dùng mới
    const userNew = await prisma.users.create({
      data: {
        email: email,
        full_name: full_name,
        pass_word: passHash,
      },
    });

    // xoá password khi trả về
    delete userNew.pass_word;

    // gửi email chào mừng
    // 1 - tốc độ: đăng ký nhanh không cần đợi email => bỏ await
    // 2 - chắc chắn: đăng ký chậm và cần phải đợi email gửi thành công => await (phía trước sendMail)
    sendMail("ngocanh76.dev@gmail.com").catch((err) => {
      // console.log(`Lỗi gửi email`, err);
    });

    //Bước4: trả kết quả thành công
    return userNew;
  },
  login: async (req) => {
    const { email, pass_word } = req.body;
    console.log({ email, pass_word });

    const userExists = await prisma.users.findFirst({
      where: {
        email: email,
      },
    });
    if (!userExists) {
      throw new BadRequestException("Tài khoản chưa tồn tại, vui lòng đăng ký");
    }
    if (!userExists.pass_word) {
      if (userExists.face_app_id) {
        throw new BadRequestException(
          "Vui lòng đăng nhập bằng facebook để cập nhập  lại mật khẩu"
        );
      }
      if (userExists.goole_id) {
        throw new BadRequestException(
          "Vui lòng đăng nhập bằng google để cập nhập  lại mật khẩu"
        );
        throw new BadRequestException(
          `Không hợp lệ tui lòng liên hệ chắm sóc khạc hàng`
        );
      }
    }
    // so sánh password
    const isPassword = bcrypt.compareSync(pass_word, userExists.pass_word);
    if (!isPassword) {
      throw new BadRequestException(
        "Mật khẩu không chính xác, vui lòng nhập lại"
      );
    }
    const tokens = authService.createTokens(userExists.user_id);
    return tokens;
  },

  // function
  facebookLogin: async (req) => {
    const { name, email, picture, id } = req.body;
    const avatar = picture.data.url;
    // console.log({ name, email, avatar, id });
    // tại sao dùng let => để gán đề giá trị lên
    let userExists = await prisma.users.findFirst({
      where: {
        email: email,
      },
    });
    if (!userExists) {
      // gán đề giá trị
      userExists = await prisma.users.create({
        data: {
          email: email,
          full_name: name,
          avatar: avatar,
          face_app_id: id,
        },
      });
    }
    const tokens = authService.createTokens(userExists.user_id);
    return tokens;
  },
  refreshToken: async (req) => {
    const refreshToken = req.headers.authorization?.split(" ")[1];
    // console.log(req.headers);
    if (!refreshToken) {
      throw new UnAuthorizationException(
        "Vui lòng cung cấp token để tiếp tục sử dụng"
      );
    }
    const accessToken = req.headers[`x-access-token`];
    if (!accessToken) {
      throw new UnAuthorizationException(
        "Vui lòng cung cấp token để tiếp tục sử dụng"
      );
    }

    const decodeRefreshToken = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const decodeAccessToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET, {
      ignoreExpiration: true,
    });

    // console.log({
    //   decodeRefreshToken,
    //   decodeAccessToken,
    // });

    if (decodeAccessToken.userId !== decodeRefreshToken.userId) {
      throw new UnAuthorizationException(`Căp token không hợp lệ`);
    }

    const userExits = await prisma.users.findUnique({
      where: {
        user_id: decodeRefreshToken.userId,
      },
    });
    if (!userExits) throw new UnAuthorizationException(`User không tồn tại`);

    const tokens = authService.createTokens(userExits.user_id);

    return tokens;
  },
  getInfo: async (req) => {
    delete req.user.pass_word;
    return req.user;
  },

  //function
  createTokens: (userId) => {
    if (!userId) throw new BadRequestException("Không có userId để tạo token");
    const accessToken = jwt.sign({ userId: userId }, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRED,
    });
    const refreshToken = jwt.sign({ userId: userId }, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRED,
    });
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  },
};

export default authService;
