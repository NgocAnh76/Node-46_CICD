const video = {
  "/video/video-list": {
    get: {
      tags: ["Videos"], //gôm nhóm
      security: [{ NgocAnhTokent: [] }], // kèm theo tokent
      parameters: [
        {
          name: "page",
          in: "query",
          description: "Nếu không truyền mặc định là 1",
        },
        {
          name: "pageSize",
          in: "query",
          description: "Nếu không truyền mặc định là 10",
        },
      ],
      responses: {
        200: {
          description: "Ok",
        },
      },
    },
  },
  "/video/video-detail/{id}": {
    get: {
      tags: ["Videos"],
      security: [{ NgocAnhTokent: [] }],
      responses: {
        200: {
          description: "Ok",
        },
      },
      parameters: [
        {
          name: "id",
          in: "path",
          description: "ID của video",
          required: true, // bắt buộc phải gửi lên
          schema: {
            type: "string", // kiểu dữ liệu
          },
        },
      ],
    },
  },
  "/video/video-create": {
    post: {
      tags: ["Videos"],
      security: [{ NgocAnhTokent: [] }],
      responses: {
        200: {
          description: "Ok",
        },
      },
      requestBody: {
        description: "Dữ liệu để tạo 1 video",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                video_name: { type: "string" },
                description: { type: "string" },
                view: { type: "number" },
              },
            },
          },
        },
      },
    },
  },
  "/video/video-update": {
    post: {
      tags: ["Videos"],
      security: [{ NgocAnhTokent: [] }],
      responses: {
        200: {
          description: "Ok",
        },
      },
      requestBody: {
        description: "Dữ liệu để update 1 video",
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                file: {
                  type: "string",
                  format: "binary",
                },
                files: {
                  type: "array",
                  items: {
                    type: "string",
                    format: "binary",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
export default video;
