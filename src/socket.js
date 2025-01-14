import { io } from 'socket.io-client';
const URL = import.meta.env.REACT_APP_BACKEND_API
export const initSocket = async () => {
    const SOCKET_URL = URL || "https://collaborative-editor-1-pll8.onrender.com";
    console.log(`Connecting to: ${SOCKET_URL}`);

    const options = {
        'force new connection': true,
        reconnectionAttempt: 'Infinity',
        timeout: 10000,
        transports: ['websocket'],
    };

    return io(SOCKET_URL, options);
};
