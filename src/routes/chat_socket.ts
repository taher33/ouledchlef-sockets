import { Socket } from "socket.io";
import { addUser, getUsers, removeUser, users } from "../users";

interface NewUserPayload {
  name: string;
  id: string;
}
type CB = (error?: string, success?: string) => any;

const chat = (socket: Socket) => {
  //adding new user
  const handleNewUser = (payload: NewUserPayload, cb: CB) => {
    //error inside of the code
    if (!payload || !cb) {
      return socket.emit(
        "server_error",
        "provide paload and cb, new user handler"
      );
    }

    if (!payload.name || !payload.id) return cb("provide name and Id");

    const { error, success } = addUser({
      id: payload.id,
      name: payload.name,
    });

    if (error) return cb(error, success);

    if (payload.id === "cl4piipay0007j7qilmonkwba") {
      socket.join("chat");
      console.log("joined chat");
    }
    console.log("socket rooms", socket.rooms);

    socket.broadcast.emit("chat:new user", {
      id: payload.id,
      name: payload.name,
    });

    return cb(error, success);
  };

  type GetUsCB = (
    error?: string,
    success?: string,
    users?: { id: string; name: string }[]
  ) => any;

  const handleGetUsers = (payload: { id?: string }, cb: GetUsCB) => {
    if (!payload || !cb) {
      return socket.emit(
        "server_error",
        "provide payload and cb, get users handler"
      );
    }

    if (!payload.id) return cb("provide id");

    cb(undefined, "success", getUsers(payload.id));
  };

  interface MessagePayload {
    sender: string;
    reciever: string;
    message: string;
  }

  const handleMessage = (payload: MessagePayload) => {
    if (!payload) return console.log("please provide payload");

    console.log("handle message", typeof payload.reciever);

    socket.to(payload.reciever).emit("chat:recieve message", payload.message);
  };

  const handleDisconnecting = () => {
    removeUser(socket.id);
    socket.broadcast.emit("chat:disconnecting", socket.id);
  };

  //event listeners
  socket.on("chat:new user", handleNewUser);
  socket.on("chat:get users", handleGetUsers);
  socket.on("chat:send message", handleMessage);
  socket.on("disconnecting", handleDisconnecting);
};

export default chat;
