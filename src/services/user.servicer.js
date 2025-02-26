import { BadRequestException } from "../common/helpers/error.helper.js";
import prisma from "../common/prisma/init.prisma.js";
import { v2 as cloudinary } from "cloudinary";

export const userService = {
  create: async function (req) {
    return `This action create`;
  },

  findAll: async function (req) {
    return `This action returns all user`;
  },

  findOne: async function (req) {
    return `This action returns a id: ${req.params.id} user`;
  },

  update: async function (req) {
    return `This action updates a id: ${req.params.id} user`;
  },

  remove: async function (req) {
    return `This action removes a id: ${req.params.id} user`;
  },
  uploadLocal: async function (req) {
    console.log({ file: req.file });

    const file = req.file;

    if (!file) {
      throw new BadRequestException("Vui lòng cung cấp hình ảnh thông qua key");
    }

    const userId = req.user.user_id;
    console.log(`numberID`, Number(userId));

    await prisma.users.update({
      where: {
        user_id: Number(userId),
      },
      data: {
        avatar: file.filename,
      },
    });

    return {
      folder: "images/",
      fileName: file.filename,
      imgUrl: `images/${file.path}`,
    };
  },
  uploadCloud: async (req) => {
    console.log({ file: req.file });

    const file = req.file;
    if (!file) {
      throw new BadRequestException("Vui lòng cung cấp hình ảnh thông qua key");
    }

    const userId = req.user.user_id;

    // Configuration
    cloudinary.config({
      cloud_name: "dlbdarhyi",
      api_key: "782482279377515",
      api_secret: "P6b4oyAII-DoQFCsWNPoIKyIOBs", // Click 'View API Keys' above to copy your API secret
    });

    const uploadResult = await new Promise((resolve) => {
      cloudinary.uploader
        .upload_stream({ folder: "images" }, (error, uploadResult) => {
          return resolve(uploadResult);
        })
        .end(file.buffer);
    });
    console.log({ uploadResult });

    //  lưu vào db
    await prisma.users.update({
      where: {
        user_id: Number(userId),
      },
      data: {
        avatar: uploadResult.secure_url,
      },
    });

    // Để đổi tên được cần đổi cloud_name `https://res.cloudinary.com/<Tên của bạn >/image/upload/`

    return {
      folder: uploadResult.folder,
      fileName: file.filename,
      imgUrl: uploadResult.secure_url,
    };
  },
};
