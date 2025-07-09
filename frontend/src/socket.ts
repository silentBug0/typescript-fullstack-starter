// src/socket.ts
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // your NestJS backend

export default socket;
