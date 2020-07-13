module.exports = (socket,event)=>{
  const Verfier = require("../../util/Verifier");
  const JWTVerifier = new Verfier();
  const findRoom = require("./middleware/findRoom");
  const sendSuccessAck = require("./middleware/sendSuccessAck");
  const sendFailureAck = require("./middleware/sendFailureAck");
  socket.on(event,(message,ack)=>{
    console.log(event);
    JWTVerifier.verify(socket,message.token)
      .then(()=>{
        return findRoom(message);
      })
      .then((room)=>{
        console.log(room);
        return sendSuccessAck(room,message,ack);
      })
      .catch((error)=>{
        return sendFailureAck(error,message,ack);
      })
  });
};