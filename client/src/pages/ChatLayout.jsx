import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';
import UserList from '../components/UserList';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

const ChatLayout = () => {
    const [selectedChannel, setSelectedChannel] = useState(null);
    const { user } = useAuth();
    const socket = useSocket();

    useEffect(() => {
        if (socket && selectedChannel) {
            socket.emit('join_channel', selectedChannel._id);
        }
    }, [socket, selectedChannel]);

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <Sidebar onSelectChannel={setSelectedChannel} selectedChannel={selectedChannel} />
            <div className="flex flex-1 flex-col min-w-0">
                {selectedChannel ? (
                    <ChatArea channel={selectedChannel} />
                ) : (
                    <div className="flex items-center justify-center flex-1 text-gray-500">
                        Select a channel to start chatting
                    </div>
                )}
            </div>
            <UserList />
        </div>
    );
};

export default ChatLayout;
