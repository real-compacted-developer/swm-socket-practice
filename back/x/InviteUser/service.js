module.exports = {
  findtargetUser: ({
    decodedUser,
    message
  }) => {
    const User = require("../../../model/User");
    return new Promise((resolve, reject) => {
      User.findOne({ id: message.id })
        .then((user) => {
          return resolve({ targetUser: user, sender: decodedUser });
        })
        .catch((error) => {
          return reject(error);
        })
    });
  },
  pushUserToRoom: ({
    result,
    message
  }) => {
    const Room = require("../../../model/Room");
    const Task = [];
    if (!result.targetUser) return Promise.reject(new Error("User Not Found"));
    const query = {
      _id: message.roomId
    };
    const update = {
      $push: {
        participants: result.targetUser._id
      }
    };
    const options = {
      new: true
    };
    result.targetUser.rooms.push(message.roomId);
    Task.push(result.targetUser.save());
    Task.push(Room.findOneAndUpdate(query, update, options).exec());
    return new Promise((resolve, reject) => {
      Promise.all(Task)
        .then((taskResults) => {
          result.taskResults = taskResults;
          return resolve(result);
        })
        .catch((errors) => {
          return reject(errors);
        });
    });
  },
  sendMessageToTargetUser: ({
    result,
    io
  }) => {
    const user = result.taskResults[0];
    const room = result.taskResults[1];
    io.to(user.socketId).emit("receiveInviteUser", { sender: result.sender, room: room });
    return Promise.resolve(result);
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