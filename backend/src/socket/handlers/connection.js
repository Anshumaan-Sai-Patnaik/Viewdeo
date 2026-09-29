const handleConnection = (socket) => {
  console.log("A client connected");
  console.log(socket.id);

  console.log("User:", socket.request.user);

  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
};

export { handleConnection };
