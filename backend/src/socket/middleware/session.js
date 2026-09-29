const wrap = (middleware) => {
  return (socket, next) => {
    middleware(socket.request, {}, next);
  };
};

export { wrap };
