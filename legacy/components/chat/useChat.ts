import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// not in use atm 

const SOCKET_SERVER_URL = 'http://localhost:3001';

const useChat = (currentUser:any, selectedUser:any) => {
    const [messages, setMessages] = useState<any>([]);
    const [socket, setSocket] = useState<any>(null);

    useEffect(() => {
        const socketInstance:any = io(SOCKET_SERVER_URL, {
            auth: { token: currentUser.token }
        });

        setSocket(socketInstance);

        socketInstance.on('connect', () => {
            console.log('Connected to the server');
        });

        socketInstance.on('receiveMessage', (message:any) => {
            setMessages((prevMessages:any) => [...prevMessages, message]);
        });

        return () => {
            socketInstance.disconnect();
        };
    }, [currentUser.token]);

    const sendMessage = (text:any) => {
        if (socket) {
            const messageData = {
                senderId: currentUser.id,
                receiverId: selectedUser.id,
                text
            };
            socket.emit('sendMessage', messageData);
        }
    };

    return { messages, sendMessage };
};

export default useChat;
