module.exports = (socket, event)=>{
  const Verfier = require("../../util/Verifier");
  const JWTVerifier = new Verfier();
  const findUser = require("./middleware/findUser");
  const sendSuccessAck = require("./middleware/sendSuccessAck");
  const sendFailureAck = require("./middleware/sendFailureAck");
  socket.on(event,(message,ack)=>{

    JWTVerifier.verify(socket,message.token)
      .then((decodedUser)=>{
        return findUser(decodedUser);
      })
      .then((user)=>{
        return sendSuccessAck(socket,message,ack,user);
      })
      .catch((error)=>{
        return sendFailureAck(error,message,ack);
      })
  });
};