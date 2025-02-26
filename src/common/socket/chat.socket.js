import prisma from "../prisma/init.prisma.js";

const handleChatSocket = (io, socket) => {
  socket.on("join-room", (data) => {
    console.log("join-room", { data });
    const { user_id_sender, user_id_recipient } = data;
    //  tạo roomId: sắp xếp 2 id lại với nhau
    const roomId = [user_id_sender, user_id_recipient]
      .sort((a, b) => a - b)
      .join("_");

    // Đẩm bảo thoát hết room trước khi join room
    socket.rooms.forEach((roomId) => {
      socket.leave(roomId);
    });
    socket.join(roomId);
  });

  socket.on("send-message", async (data) => {
    console.log({ data });
    const { message, user_id_sender, user_id_recipient } = data;
    const roomId = [user_id_sender, user_id_recipient]
      .sort((a, b) => a - b)
      .join("_");
    io.to(roomId).emit("receive-message", data);

    await prisma.chats.create({
      data: {
        message: message,
        user_id_sender: user_id_sender,
        user_id_recipient: user_id_recipient,
      },
    });
  });

  // Nên lấy message ban đầu khởi tạo bằng API
  // Không nên dùng bằng socket như phía dưới (vì sau này phát triển tính năng sẻ khó: VD như phân trang)
  socket.on("get-list-message", async (data) => {
    console.log({ data });
    const { user_id_sender, user_id_recipient } = data;

    const chats = await prisma.chats.findMany({
      where: {
        OR: [
          // lấy tin nhắn của chình mình
          {
            user_id_recipient: user_id_recipient,
            user_id_sender: user_id_sender,
          },
          // lấy tin nhắn của đối phương
          {
            user_id_recipient: user_id_sender,
            user_id_sender: user_id_recipient,
          },
        ],
      },
    });
    socket.emit("get-list-message", chats);
  });
};
export default handleChatSocket;
