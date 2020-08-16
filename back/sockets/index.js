module.exports = function () {
  const io = require("../bin/www").io;

  const imageSocket = require("./image");

  io.on("connect", (socket) => {
    // 디버그를 위한 코드. 필요 시 삭제할 수 있습니다.
    console.log(`새로운 클라이언트가 접속하였습니다. ${socket.id}`);
    socket.join("roomNumber");
    imageSocket(socket);
  });
};
