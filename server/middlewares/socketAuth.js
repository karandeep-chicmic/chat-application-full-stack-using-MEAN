const jwt = require("jsonwebtoken");

const socketAuth = () => {
  return (socket, next) => {
    const { token } = socket.handshake.auth;

    if (token) {
      jwt.verify(
        token,
        "537f5ede884e9d34bb82f7c54c5c7dd0e9fcbe533584fcefe69df5231bd02e453bdbcd264c6bcebfaa31a97553ff3723d87d629a9821a07f82799253edb94a5f",
        (err, data) => {
          if (err) {
            throw err;
          } else {
            console.log("Token Verified through middleware");
            next();
          }
        }
      );
    } else {
      throw new Error("Token is not even generated !!");
    }
  };
};

module.exports = { socketAuth };
