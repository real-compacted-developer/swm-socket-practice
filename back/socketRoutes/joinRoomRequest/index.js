module.exports = (socket, event) => {
  const verify = require("../../module/util/verify");
  const JWTVerify = new verify();
  const joinService = require("./service");
  socket.on(event, (message, ack) => {
    JWTVerify.verify(socket, message.token)
      .then(() => {
        return joinService.joinRoom(message, socket);
      })
      .then((result) => {
        return joinService.sendSuccessAck(result, message, ack);
      })
      .catch((error) => {
        return joinService.sendFailureAck(error, message, ack);
      })
  });
};