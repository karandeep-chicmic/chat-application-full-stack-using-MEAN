

    // socket.on("register", (username) => {
    //   users[username] = socket.id;
    //   // console.log("ffffffffffffff", users[username]);
    //   console.log(`User ${username} registered with socket ID ${socket.id}`);
    //   console.log(users);
    // });

    // // Listen for 'private message' event to send message to a specific user
    // socket.on("private message", ({ to, message }) => {
    //   const targetSocketId = users[to];
    //   if (targetSocketId) {
    //     io.to(targetSocketId).emit("private message", {
    //       from: socket.id,
    //       message,
    //     });
    //   }
    // });

    // socket.on("disconnect", () => {
    //   console.log("User disconnected: " + socket.id);

    //   // Remove user from users object
    //   for (const username in users) {
    //     if (users[username] === socket.id) {
    //       delete users[username];
    //       break;
    //     }
    //   }
    // });

    // ////////////////////////////////////////////////////////
    socket.on("join room", (room) => {
      socket.join(room);

      console.log(`User ${socket.id} joined room ${room}`);
    });

    // Leaving a room
    socket.on("leave room", (room) => {
      socket.leave(room);
      console.log(`User ${socket.id} left room ${room}`);
    });

    // Sending a message to a specific room
    socket.on("room message", ({ room, message }) => {
      io.to(room).emit("room message", {
        user: socket.id,
        message,
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected with id : ", socket.id);
    });

    // // acknowledgement event
    // socket.on("update item", (arg1, arg2, callback) => {
    //   console.log(arg1); // 1
    //   console.log(arg2); // { name: "updated" }
    //   callback({
    //     status: "ok",
    //   });
    // });