module.exports = (socket,event)=>{
  const verify = require("../../module/util/verify");
  const JWTVerify = new verify();
  const createService = require("./service");
  socket.on(event,(message,ack)=>{
    JWTVerify.verify(socket,message.token)
      .then((decodedUser)=>{
        return createService.createRoom(decodedUser,message);
      })
      .then((result)=>{
        return createService.pushRoomToUser(result);
      })
      .then((result)=>{
        return createService.joinRoom(socket,result);
      })
      .then((result)=>{
        return createService.sendSuccessAck(result,message,ack);
      })
      .catch((error)=>{
        return createService.sendFailureAck(error,message,ack);
      })
  });
}