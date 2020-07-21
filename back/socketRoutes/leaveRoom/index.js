module.exports = (socket, event)=>{
  const Verfier = require("../../util/Verifier");
  const JWTVerifier = new Verfier();
  const findRoom = require("./middleware/findRoom");
  const pullRoomToUser = require("./middleware/pullRoomToUser");
  const sendSuccessAck = require("./middleware/sendSuccessAck");
  const sendFailureAck = require("./middleware/sendFailureAck");
  socket.on(event,(message,ack)=>{

    JWTVerifier.verify(socket,message.token)
      .then((decodedUser)=>{
        return findRoom(decodedUser,message);
      })
      .then((result)=>{
        return pullRoomToUser(socket,result);
      })
      .then((result)=>{
        return sendSuccessAck(result,message,ack);
      })
      .catch((error)=>{
        return sendFailureAck(error,message,ack);
      })
  });
};