import { Server } from 'http';
import { UserDocument } from '../utils';

export const SOCKET_EVENTS = {
  ADD_USER: "ADD_USER",
  ACTIVE_USERS: "ACTIVE_USERS",
  MESSAGE_SENT: "MESSAGE_SENT",
  TYPING: "TYPING",
  TYPING_END: "TYPING_END",
}

let ACTIVE_USERS: (UserDocument & { socketId: string })[] = [];
export function initSocket(server: Server) {
  const io = require('socket.io')(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on("connection", (client: any) => {
    console.log("Connected", client.id);

    client.on(SOCKET_EVENTS.ADD_USER, (user: UserDocument & { socketId: string }) => {
      const isUserExist = ACTIVE_USERS.some(u => u._id === user._id);
      if (!isUserExist) {
        ACTIVE_USERS.push(user);
      }
      io.sockets.emit(SOCKET_EVENTS.ACTIVE_USERS, ACTIVE_USERS);
    })

    client.on(SOCKET_EVENTS.MESSAGE_SENT, ({ sender, receiver }: { sender: UserDocument, receiver: UserDocument }) => {
      const receiverSocId = ACTIVE_USERS.find(u => u._id === receiver._id)?.socketId;
      if (!receiverSocId) return;
      client.broadcast.to(receiverSocId).emit(SOCKET_EVENTS.MESSAGE_SENT, { sender, receiver });
    })

    client.on(SOCKET_EVENTS.TYPING, ({ sender, receiver }: { sender: UserDocument, receiver: UserDocument }) => {
      const receiverSocId = ACTIVE_USERS.find(u => u._id === receiver._id)?.socketId;
      if (!receiverSocId) return;
      client.broadcast.to(receiverSocId).emit(SOCKET_EVENTS.TYPING, { sender, receiver });
    })

    client.on(SOCKET_EVENTS.TYPING_END, ({ sender, receiver }: { sender: UserDocument, receiver: UserDocument }) => {
      const receiverSocId = ACTIVE_USERS.find(u => u._id === receiver._id)?.socketId;
      if (!receiverSocId) return;
      client.broadcast.to(receiverSocId).emit(SOCKET_EVENTS.TYPING_END, { sender, receiver });
    })

    client.on('disconnect', () => {
      ACTIVE_USERS = ACTIVE_USERS.filter(u => u.socketId !== client.id);
      io.sockets.emit(SOCKET_EVENTS.ACTIVE_USERS, ACTIVE_USERS);
    });
  });

  return io;
}