import { Socket } from "socket.io";
import { addUser } from "../users";

type NewUserPayload = {
  name: string;
};
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

  //event listeners
  socket.on("chat:new user", handleNewUser);
};

export default chat;
