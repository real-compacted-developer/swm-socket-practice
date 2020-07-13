const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const io = require("socket.io")();

const indexRouter = require("./routes");
const socketRouter = require("./socketRoutes");

const app = express();
app.io = io;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
io.use(socketRouter.handshake);
io.on("connection",(socket)=>{
  socketRouter.functions.TokenRefreshEmmit(socket);
  socketRouter.functions.SetSocketId(socket).then((user)=>{
    socketRouter.functions.JoinRooms(user,socket);
  });
  socketRouter.createRoom(socket,socketRouter.event.createRoom);
  socketRouter.hello(socket,socketRouter.event.hello);
  socketRouter.disconnect(socket,socketRouter.event.disconnect);
  socketRouter.searchUser(socket,socketRouter.event.searchUser);
  socketRouter.roomListSearch(socket,socketRouter.event.roomListSearch);
  socketRouter.InviteUser(socket,io,socketRouter.event.InviteUser);
  socketRouter.leaveRoom(socket,socketRouter.event.leaveRoom);
  socketRouter.searchFriend(socket,socketRouter.event.searchFriend);
  socketRouter.requestFriendShipUser(socket,socketRouter.event.requestFriendShipUser);
  socketRouter.acceptFriendShipRequest(socket,socketRouter.event.acceptFriendShipRequest);
  socketRouter.denyFriendShipRequest(socket,socketRouter.event.denyFriendShipRequest);
  socketRouter.removeFriendShipRequest(socket,socketRouter.event.removeFriendShipRequest);
  socketRouter.messageSend(io,socket,socketRouter.event.messageSend);
  socketRouter.messageLoad(socket,socketRouter.event.messageLoad);
  socketRouter.searchFriendRequest(socket,socketRouter.event.searchFriendRequest);
  socketRouter.joinRoomRequest(socket,socketRouter.event.joinRoomRequest);

});
// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;