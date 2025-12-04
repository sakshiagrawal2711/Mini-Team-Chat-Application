import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';
import UserList from '../components/UserList';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

const ChatLayout = () => {
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isUserListOpen, setIsUserListOpen] = useState(false);
    const { user } = useAuth();
    const socket = useSocket();

    useEffect(() => {
        if (socket && selectedChannel) {
            socket.emit('join_channel', selectedChannel._id);
        }
    }, [socket, selectedChannel]);

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden flex-col lg:flex-row">
            {/* Mobile Header */}
            <div className="lg:hidden bg-gray-900 text-white p-4 flex justify-between items-center shadow-md z-20">
                <button onClick={() => setIsSidebarOpen(true)} className="text-gray-300 hover:text-white focus:outline-none">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
                <h1 className="font-bold text-lg">Mini Chat</h1>
                <button onClick={() => setIsUserListOpen(true)} className="text-gray-300 hover:text-white focus:outline-none">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                </button>
            </div>

            {/* Sidebar Drawer */}
            <div className={`fixed inset-0 z-30 lg:static lg:z-auto lg:block transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="absolute inset-0 bg-black opacity-50 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
                <div className="relative h-full flex">
                    <Sidebar
                        onSelectChannel={(channel) => {
                            setSelectedChannel(channel);
                            setIsSidebarOpen(false);
                        }}
                        selectedChannel={selectedChannel}
                    />
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden absolute top-4 right-[-40px] text-white p-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            </div>

            <div className="flex flex-1 flex-col min-w-0 h-full relative">
                {selectedChannel ? (
                    <ChatArea channel={selectedChannel} />
                ) : (
                    <div className="flex items-center justify-center flex-1 text-gray-500 p-4 text-center">
                        Select a channel to start chatting
                    </div>
                )}
            </div>

            {/* UserList Drawer */}
            <div className={`fixed inset-0 z-30 lg:static lg:z-auto lg:block transition-transform transform ${isUserListOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0`}>
                <div className="absolute inset-0 bg-black opacity-50 lg:hidden" onClick={() => setIsUserListOpen(false)}></div>
                <div className="relative h-full flex justify-end">
                    <div className="h-full bg-white shadow-xl lg:shadow-none">
                        <UserList />
                    </div>
                    <button onClick={() => setIsUserListOpen(false)} className="lg:hidden absolute top-4 left-[-40px] text-white p-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatLayout;
