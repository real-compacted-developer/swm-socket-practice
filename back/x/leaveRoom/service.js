module.exports = {
  findRoom: ({
    decodedUser,
    message
  }) => {
    const Room = require("../../../model/Room");
    return new Promise((resolve, reject) => {
      Room.findOne({ _id: message._id })
        .then((room) => {
          return resolve({ user: decodedUser, room: room })
        })
        .catch((error) => {
          return reject(error);
        })
    });
  },
  pullRoomToUser: ({
    socket, result
  }) => {
    const User = require("../../../model/User");

    const query = {
      _id: result.user._id
    };
    const update = {
      $pull: {
        rooms: result.room._id
      }
    };
    const options = {
      new: true
    };
    return new Promise((resolve, reject) => {
      User.findOneAndUpdate(query, update, options)
        .then((user) => {
          result.user = user;
          socket.leave(result.room._id, (error) => {
            if (error) {
              return reject(error);
            }
            return resolve(result);
          });
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