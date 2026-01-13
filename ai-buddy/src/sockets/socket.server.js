const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const agent = require("../../agent/agent");


async function initSocketServer(httpServer) {
  const io = new Server(httpServer, {});

  io.use((socket, next) => {
    const cookies = socket.handshake.headers.cookie;

    const { token } = cookies ? cookie.parse(cookies) : {};

    if (!token) return next(new Error("Token not Provided!"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      socket.token = token;
      next();
    } catch (err) {
      return next(new Error("Authentication error: Invalid Token"));
    }
  });



  io.on("connection", (socket) => {

    socket.on("message", async (data) => {

      const message = await agent.invoke({
        messages: [
          {
            role: "user",
            content: data
          }
        ]
      },
        {
          metadata: { token: socket.token }
        })

      const reply = message.messages[message.messages.length - 1].text;

      socket.emit("message", reply);
    })

  });
}

module.exports = { initSocketServer };
