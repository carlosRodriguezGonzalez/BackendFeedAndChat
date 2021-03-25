const { checkJWT } = require("../helpers/jwt");
const {
  getUsers,
  saveMessage,
  userConnected,
  userDisconnected,
  getSessionId,
} = require("../controllers/sockets");

class Sockets {
  constructor(io) {
    this.io = io;

    this.socketEvents();
  }

  socketEvents() {
    // On connection
    this.io.on("connection", async (socket) => {
      const [valido, uid] = checkJWT(socket.handshake.query["x-token"]);

      if (!valido) {
        console.log("socket no identificado");
        return socket.disconnect();
      }

      const sessionId = await getSessionId(uid);
      if (!sessionId) {
        console.log("user:", uid, " without sessionId");
        return socket.disconnect();
      }

      await userConnected(uid);
      // Unir al usuario a una sala de socket
      socket.join(uid);

      // Unir al usuario a la sala general
      socket.join(sessionId);

      this.io.emit("users-list", await getUsers(sessionId));

      socket.on("personal-message", async (payload) => {
        const message = await saveMessage(payload);
        this.io.to(payload.to).emit("personal-message", message);
        this.io.to(payload.from).emit("personal-message", message);
      });

      socket.on("general-message", async (payload) => {
        const message = await saveMessage(payload);
        this.io.to(payload.sessionId).emit("general-message", message);
        this.io.to(payload.from).emit("confirmation", "OK :)");
      });

      socket.on("disconnect", async () => {
        await userDisconnected(uid);
        this.io.emit("users-list", await getUsers());
      });
    });
  }
}

module.exports = Sockets;
