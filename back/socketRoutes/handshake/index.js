module.exports = (socket,next)=>{
  const User =require("../../model/User");
  const jsonwebtoken = require("jsonwebtoken");
  const token = socket.handshake.query.token;
  const { secretOrPrivateKey } = require("../../config/jwtSecretKey");
  console.log(`token is ${token}`);
  jsonwebtoken.verify(token,secretOrPrivateKey,(err,decodedUser)=>{
    if(err){
      if(err.name==="TokenExpiredError"){
        socket.isExistNewToken = true;
        return next();
      }else{
        return next(new Error("Unauthorized"));
      }
    }
    User.findOne({id:decodedUser.id})
      .then((user)=>{
        if(!user){
          return next(new Error("Unauthorized"));
        }
        user.token===token?next():next(new Error("Unauthorized"));
        return;
      })
      .catch(()=>{
        return next(new Error("Unauthorized"));
      });
  });
};