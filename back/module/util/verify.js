const jsonwebtoken = require("jsonwebtoken");
const { secretOrPrivateKey } = require("../../config/jwtSecretKey");
  
function verify() {
  if(!(this instanceof verify)){
    throw new Error("muse be created with new keyword");
  }
}

verify.prototype.verify = function (socket, token) {
  return new Promise((resolve,reject)=>{
    jsonwebtoken.verify(token,secretOrPrivateKey,(err,decodedUser)=>{
      if(err){
        if(err.name === "TokenExpiredError"){
          socket.isExistNewToken = true;
          socket.emit("tokenRefresh-Required");
          return reject(err);
        }else{
          return reject(err);
        }
      }
      return resolve(decodedUser);
    });
  });
};

module.exports=verify;