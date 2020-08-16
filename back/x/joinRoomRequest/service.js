module.exports = {
  joinRoom: ({
    message,
    socket
  }) => {
    return new Promise((resolve, reject) => {
      if (!message) return reject(new Error("Invalid Message"));
      socket.join(message.room._id);
      return resolve(message);
    });
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