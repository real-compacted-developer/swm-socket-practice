const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
//const fs = require("fs");
const imagesPath = [
  "https://images.vexels.com/media/users/3/131484/isolated/preview/a432fa4062ed3d68771db7c1d65ee885-minus-inside-circle-icon-by-vexels.png",
  "https://cdn3.iconfinder.com/data/icons/glypho-generic-icons/64/plus-big-512.png",
  "https://cdn1.iconfinder.com/data/icons/main-ui-elements-with-colour-bg/512/male_avatar-128.png",
  "https://cdn1.iconfinder.com/data/icons/main-ui-elements-with-colour-bg/512/home-128.png"
];
const size = imagesPath.length;
io.on("connection", (socket) => {
  const { id } = socket.client;
  console.log(`User Connected: ${id}`);
  socket.on("chat message", ({ nickname, msg }) => {
    io.emit("chat message", { nickname, msg });
  });
  socket.on("image Change", ({ index, urlInfo }) => {
    console.log("index : ", index, "client.id : ", id);
    if (index >= size - 1) {
      index = 0;
      urlInfo = imagesPath[index];
      console.log("index 초과 index 재설정");
    } else {
      urlInfo = imagesPath[++index];
    }
    io.emit("image Change", { index, urlInfo });
  });
  // fs.readFile(__dirname + "/image.jpg", function (err, buf) {
  //   // it"s possible to embed binary data
  //   // within arbitrarily-complex objects
  //   socket.emit("image", { image: true, buffer: buf.toString("base64") });
  //   console.log("image file is initialized");
  // });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => console.log(`Listen on *: ${PORT}`));