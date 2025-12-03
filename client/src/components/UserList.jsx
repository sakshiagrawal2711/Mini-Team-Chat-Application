import { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { FaCircle } from 'react-icons/fa';

const UserList = () => {
    const [onlineUsers, setOnlineUsers] = useState([]);
    const socket = useSocket();

    useEffect(() => {
        if (!socket) return;

        socket.on('online_users', (users) => {
            setOnlineUsers(users);
        });

        return () => {
            socket.off('online_users');
        };
    }, [socket]);

    return (
        <div className="w-64 bg-white border-l border-gray-200 hidden lg:block flex-shrink-0">
            <div className="p-4 border-b border-gray-200">
                <h2 className="font-bold text-gray-700">Online Users</h2>
            </div>
            <ul className="p-4 overflow-y-auto h-full">
                {onlineUsers.map(user => (
                    <li key={user._id} className="flex items-center mb-2 text-gray-700">
                        <FaCircle className="text-green-500 text-xs mr-2" />
                        <span className="truncate">{user.username}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
