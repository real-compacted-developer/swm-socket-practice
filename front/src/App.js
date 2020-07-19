import React, { Component } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3002");
var image = require('./image.png');
class App extends Component {
  constructor() {
    super();
    this.state = { msg: "", chat: [], nickname: "", image: "", index: 0, urlInfo: "https://images.vexels.com/media/users/3/131484/isolated/preview/a432fa4062ed3d68771db7c1d65ee885-minus-inside-circle-icon-by-vexels.png" };
  }
  toggleImage = () => {
    const { index, urlInfo } = this.state;
    socket.emit("image Change", { index, urlInfo });
  }
  componentDidMount() {
    socket.on("chat message", ({ nickname, msg }) => {
      this.setState({
        chat: [...this.state.chat, { nickname, msg }]
      });
    });
    socket.on("image Change", ({ index, urlInfo }) => {
      this.setState({
        index: index,
        urlInfo: urlInfo
      });
    });
  }
  onTextChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onMessageSubmit = () => {
    const { nickname, msg } = this.state;
    this.setState({ image: "image.png" })
    socket.emit("chat message", { nickname, msg, image });
    this.setState({ msg: "" });
  };
  renderImage() {
    let { urlInfo } = this.state;
    console.log(urlInfo);
    return (
      <div>
        <img
          src={urlInfo}
          alt=""
          onClick={this.toggleImage}
        />

      </div>
    )
  }
  renderChat() {
    const { chat } = this.state;
    return chat.map(({ nickname, msg }, idx) => (
      <div key={idx}>
        <span style={{ color: "green" }}>{nickname}: </span>

        <span>{msg}</span>
      </div>
    ));
  }

  render() {
    return (
      <div>
        <span>Nickname</span>
        <input
          name="nickname"
          onChange={e => this.onTextChange(e)}
          value={this.state.nickname}
        />
        <span>Message</span>
        <input
          name="msg"
          onChange={e => this.onTextChange(e)}
          value={this.state.msg}
        />
        <button onClick={this.onMessageSubmit}>
          Send
        </button>
        <div>
          {this.renderImage()}
        </div>
        <div>{this.renderChat()}</div>
      </div>
    );
  }
}

export default App;