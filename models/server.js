// Servidor de Express
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");
const cors = require("cors");

const Sockets = require("./sockets");
const { dbConnection } = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    // Conectar a DB
    dbConnection();

    // Http server
    this.server = http.createServer(this.app);

    // Configuraciones de sockets
    this.io = socketio(this.server, {
      /* configuraciones */
    });
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // body
    this.app.use(express.json());

    // End Points
    this.app.use("/api/login", require("../router/auth"));
    this.app.use("/api/message", require("../router/message"));
  }

  configurarSockets() {
    new Sockets(this.io);
  }

  execute() {
    // Middlewares
    this.middlewares();

    // Sockets
    this.configurarSockets();

    // Server
    this.server.listen(this.port, () => {
      console.log("Server corriendo en puerto:", this.port);
    });
  }
}

module.exports = Server;
