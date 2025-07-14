import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let reconnectErrorShown = false;

export const connectSocket = () => {
  if (!socket?.connected) {
    socket = io("http://localhost:3000", {
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.on("connect", () => {
      toast.success("Connected to server ✅");
      socket?.emit("getTasks"); // ✅ Optional chaining used
    });

    socket.on("disconnect", () => {
      if (!reconnectErrorShown) {
        toast.error("Disconnected from server", { toastId: "socket-disconnect" });
        reconnectErrorShown = true;

        setTimeout(() => {
          reconnectErrorShown = false; // allow new toasts after 5 sec
        }, 5000);
      }
    });
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
