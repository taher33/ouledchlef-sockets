import { Socket } from "socket.io";
import { addUser, getUsers, removeUser } from "../users";

interface NewUserPayload {
  name: string;
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

    if (!payload.name) return cb("provide name");

    const { error, success } = addUser({ id: socket.id, name: payload.name });

    if (error) return cb(error, success);

    socket.broadcast.emit("chat:new user", socket.id);

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

  const handleDisconnecting = () => {
    removeUser(socket.id);
    socket.broadcast.emit("chat:disconnecting", socket.id);
  };

  //event listeners
  socket.on("chat:new user", handleNewUser);
  socket.on("chat:get users", handleGetUsers);
  socket.on("disconnecting", handleDisconnecting);
};

export default chat;
