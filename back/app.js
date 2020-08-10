const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
//const fs = require("fs");
const imagesPath = [
  "https://connect-class-test.s3.ap-northeast-2.amazonaws.com/StudyGroup1/week1/cat1.jpg",
  "https://connect-class-test.s3.ap-northeast-2.amazonaws.com/StudyGroup1/week1/cat2.jpg",
  "https://connect-class-test.s3.ap-northeast-2.amazonaws.com/StudyGroup1/week1/cat3.jpg",
  "https://connect-class-test.s3.ap-northeast-2.amazonaws.com/StudyGroup1/week1/puppy1.jpg"
];
let idx = 0;
let url = imagesPath[0];
const size = imagesPath.length;
io.on("connection", (socket) => {
  socket.join("roomNumber1");
  socket.emit("initialize", ({ idx, url }));
  socket.on("chat message", ({ nickname, msg }) => {
    io.emit("chat message", { nickname, msg });
  });
  // socket.on("image Change", ({ index, urlInfo }) => {
  //   if (index >= size - 1) {
  //     index = 0;
  //     urlInfo = imagesPath[index];
  //     console.log("index 초과 index 재설정");
  //   } else {
  //     urlInfo = imagesPath[++index];
  //   }
  //   io.emit("image Change", { index, urlInfo });
  // });
  socket.on("image Prev", ({ index, urlInfo }) => {
    if (index == 0) {
      index = size - 1;
    } else {
      index -= 1;
    }
    urlInfo = imagesPath[index];
    idx = index;
    url = urlInfo;
    io.in("roomNumber1").emit("image Change", idx, url);
  });
  socket.on("image Next", ({ index, urlInfo }) => {
    if (index >= size - 1) {
      index = 0;
    } else {
      index += 1;
    }
    urlInfo = imagesPath[index];
    idx = index;
    url = urlInfo;
    io.in("roomNumber1").emit("image Change", { idx, url });
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