import { io, Socket } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

// Global singleton connection to the /admin namespace
export const socket: Socket = io(`${BACKEND_URL}/admin`, {
  autoConnect: true,
  reconnection: true,
  transports: ['websocket', 'polling']
});

export function initSocket() {
  socket.on('connect', () => {
    console.log('Connected to admin socket namespace');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from admin socket namespace');
  });
}
