import { describe, expect, it, jest } from "@jest/globals";
import authService from "../../services/auth.service.js";
import prisma from "../prisma/init.prisma.js";
import { REGEX_EMAIL } from "../constant/app.constant.js";

//describe ->  tiêu đề, gôm nhóm các case (trường hợp)
describe("Auth service", () => {
  // it -> viết cụ thể test case
  // beforeEach chạy trước mỗi lần IT chạy. Thường dùng để khởi tạo dữ liệu đầu vào
  // afterEach chạy sau mỗi lần IT chạy, thường dùng để làm mới dữ liệu

  beforeEach(() => {
    // console.log("BeforeEach chạy");
    jest.spyOn(prisma.users, "create");
    jest.spyOn(prisma.users, "findFirst");
  });

  afterEach(() => {
    // console.log("AfterEach chạy");
    jest.restoreAllMocks();
  });

  it("Case 1: Trường hợp đằng ký thành công với thông tin hợp lệ", async () => {
    // console.log("Case 1");

    //giả lập đầu ra của hai hàm findFirst và create VỚI THÔNG TIN HỢP LỆ
    await prisma.users.findFirst.mockResolvedValue(undefined);
    await prisma.users.create.mockResolvedValue({
      user_id: 12,
      email: "Nguenthitest@gmail.com",
      full_name: "NguyenThiTest",
      avatar: null,
      goole_id: null,
      face_app_id: null,
      created_at: "2025-02-14T06:22:49.000Z",
      updated_at: " 2025-02-14T06:22:49.000Z",
      role_id: 2,
    });

    const req = {
      body: {
        full_name: "NguyenThiTest",
        email: "Nguenthitest@gmail.com",
        pass_word: "1234",
      },
    };
    const userNew = await authService.register(req);
    console.log({ userNew });

    // Kiểm tra kết quả
    expect(userNew).not.toHaveProperty("pass_word"); //không được có key pass word
    expect(typeof userNew.email).toBe("string"); //  email phải là chuỗi
    expect(REGEX_EMAIL.test(userNew.email)).toBe(true); // email phải đúng định dạng
  });
  it("Case 2: Trường hợp đăng ký email đã tồn tại cần phải báo lỗi", () => {
    // console.log("Case 2");
    // throw new Error()
  });
});
