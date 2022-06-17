import express from "express";
import { Server } from "socket.io";
import http from "http";
import chat from "./routes/chat_socket";

const port = 5000 || process.env.PORT;

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Origin",
      "my-custom-header",
    ],
  },
});

io.on("connection", (socket) => {
  chat(socket);
});

app.get("/", ({ req, res }: any) => {
  res.send("hey there");
});

server.listen(port, () => {
  console.log("Server started on port " + port);
});
