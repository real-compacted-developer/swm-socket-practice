module.exports = {
  broadcastMessage: ({
    messageObject,
    socket
  }) => {
    console.log(messageObject);

    socket.in(messageObject.room).emit("broadcastMessage", messageObject);
    return Promise.resolve(messageObject);
  },
  populateMessage: ({
    messageObject
  }) => {
    return messageObject.populate("sender").execPopulate();
  },
  pushMessageToRoom: ({
    messageObject
  }) => {
    console.log(messageObject);
    const Room = require("../../../model/Room");
    const query = {
      _id: messageObject.room
    };
    const update = {
      $push: {
        messages: messageObject._id
      }
    };
    const options = {
      new: true
    };
    return new Promise((resolve, reject) => {
      Room.findOneAndUpdate(query, update, options).exec()
        .then(() => {
          return resolve(messageObject);
        })
        .catch((error) => {
          return reject(error);
        })
    });
  },
  saveMessage: ({
    message,
    decodedUser
  }) => {
    const Message = require("../../../model/Message");
    const messageObjet = new Message({
      sender: decodedUser._id,
      message: message.message,
      room: message.room
    });
    return messageObjet.save();
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