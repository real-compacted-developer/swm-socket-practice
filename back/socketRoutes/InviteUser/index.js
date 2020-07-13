module.exports = (socket,io, event)=>{
  const Verfier = require("../../module/util/verify");
  const JWTVerify = new Verfier();
  const inviteService = require("./service");
  socket.on(event,(message,ack)=>{

    JWTVerify.verify(socket,message.token)
      .then((decodedUser)=>{
        return inviteService.findTargetUser(decodedUser,message);
      })
      .then((result)=>{
        return inviteService.pushUserToRoom(result,message);
      })
      .then((result)=>{
        return inviteService.sendMessageToTargetUser(result,io);
      })
      .then((result)=>{
        return inviteService.sendSuccessAck(result,message,ack);
      })
      .catch((error)=>{
        return inviteService.sendFailureAck(error,message,ack);
      })
  });
};