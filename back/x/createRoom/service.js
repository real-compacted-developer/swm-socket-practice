module.exports = {
  createRoom: ({
    decodedUser,
    message
  }) => {
    const Room = require("../../../model/Room");
    const room = new Room({
      roomName: message.roomName
    });

    room.participants.push(decodedUser._id);
    return new Promise((resolve, reject) => {
      room.save()
        .then((room) => {
          return resolve({ user: decodedUser, room: room });
        })
        .catch((error) => {
          return reject(error);
        })
    });
  },
  joinRoom: ({
    socket,
    result
  }) => {
    socket.join(result.room._id);
    return Promise.resolve(result);
  },
  pushRoomToUser: ({
    result
  }) => {
    const User = require("../../../model/User");
    const query = {
      _id: result.user._id
    };
    const update = {
      $push: {
        rooms: result.room._id
      }
    };
    const options = {
      new: true
    };

    return new Promise((resolve, reject) => {
      User.findOneAndUpdate(query, update, options).exec()
        .then((user) => {
          result.user = user;
          return resolve(result);
        })
        .catch((error) => {
          return reject(error);
        })
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