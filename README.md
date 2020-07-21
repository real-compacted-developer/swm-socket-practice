# swm-socket-practice

Socket Practice with react &amp; express

## Back

- socket.io 모듈을 사용하여 Socket 통신(이미지)을 구현하였다.

### Image

- 이미지는 임의의 데이터를 사용하였다.
- 길이가 4인 imagesPath 배열을 사용하였다.

### Socket

- socket은 총 3가지 명령어로 구성되어 있다.

#### 1. Image Change

- socket.emit을 통해 모든 클라이언트의 state 값을 바꿔준다.
- index와 urlInfo를 수정해준다.

#### 2. Image Prev

- socket.on을 통해 클라이언트에게 값을 받아와 다음과 같은 일을 수행한다.
  - index의 값이 imagesPath의 길이(size)보다 작은지 비교해줌으로써 알맞는 index값과 그에 맞는 urlInfo를 socket을 통해 보내준다.

#### 3. Image Next

- socket.on을 통해 클라이언트에게 값을 받아와 다음과 같은 일을 수행한다.
  - index의 값이 imagesPath의 길이(size)보다 큰지 비교해줌으로써 알맞는 index값과 그에 맞는 urlInfo를 socket을 통해 보내준다.

## Front

- socket.io-client 모듈을 사용하여 Socket 통신(이미지)을 구현하였다.

### Socket

- socket은 총 3가지 명령어로 구성되어 있다.

#### 1. Image Change

- socket.on을 통해 서버에서 받은 state 값을 바꿔준다.
- index와 urlInfo를 수정해준다.

#### 2. Image Prev

- socket.emit을 통해 서버에게 값을 보낸다.
- index와 urlInfo를 수정해준다.

#### 3. Image Next

- socket.emit을 통해 서버에게 값을 보낸다.
- index와 urlInfo를 수정해준다.
