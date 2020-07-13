module.exports = {
  findRoom: ({
    message,
  }) => {
    const Room = require("../../../model/Room");
    return Room.findOne({_id:message._id})
      .populate({
        path:"messages",
        populate:{
          path:"sender",
          model:"User"
        }
      })
  },
  sendFailureAck: ({
    error,
    message,
    ack
  }) => {
    console.log(error);
    message.result = message;
    message.isSuccess = false;
    message.Error = error;
    ack(message);
    return Promise.resolve();
  },
  sendSuccessAck: ({
    result,
    message,
    ack
  }) => {
    message.result = result;
    message.isSuccess = true;
    message.Error = undefined;
    ack(message);
    return Promise.resolve();
  },
}