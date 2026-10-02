const handleDisconnect = (socket) => {
  console.log(`Client ${socket.id} disconnected`);
};

export { handleDisconnect };
