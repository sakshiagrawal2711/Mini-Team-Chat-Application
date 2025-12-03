import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import MessageBubble from './MessageBubble';
import { FaPaperPlane } from 'react-icons/fa';

const ChatArea = ({ channel }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    const { user } = useAuth();
    const socket = useSocket();

    useEffect(() => {
        setMessages([]);
        setPage(1);
        setHasMore(true);
        fetchMessages(1, true);
    }, [channel._id]);

    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (message) => {
            if (message.channel === channel._id) {
                setMessages((prev) => [...prev, message]);
                scrollToBottom();
            }
        };

        socket.on('receive_message', handleReceiveMessage);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
        };
    }, [socket, channel._id]);

    const fetchMessages = async (pageNum, replace = false) => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`http://localhost:5000/api/messages/${channel._id}?page=${pageNum}&limit=20`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.length < 20) setHasMore(false);

            if (replace) {
                setMessages(data);
                setTimeout(scrollToBottom, 100);
            } else {
                setMessages((prev) => [...data, ...prev]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleScroll = (e) => {
        if (e.target.scrollTop === 0 && hasMore) {
            const prevHeight = e.target.scrollHeight;
            setPage((prev) => prev + 1);
            fetchMessages(page + 1).then(() => {
                requestAnimationFrame(() => {
                    if (chatContainerRef.current) {
                        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight - prevHeight;
                    }
                });
            });
        }
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const messageData = {
            channel: channel._id,
            content: newMessage,
            sender: user._id,
        };

        socket.emit('send_message', messageData);
        setNewMessage('');
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="p-4 border-b border-gray-200 shadow-sm bg-gray-50">
                <h2 className="text-lg font-bold text-gray-800">#{channel.name}</h2>
                <p className="text-sm text-gray-500">{channel.description || 'No description'}</p>
            </div>

            <div
                className="flex-1 overflow-y-auto p-4 bg-gray-100"
                ref={chatContainerRef}
                onScroll={handleScroll}
            >
                {messages.map((msg, index) => (
                    <MessageBubble
                        key={msg._id || index}
                        message={msg}
                        isOwn={msg.sender._id === user._id || msg.sender === user._id}
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 bg-white flex items-center">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Message #${channel.name}`}
                    className="flex-1 border border-gray-300 rounded-l-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-r-full hover:bg-blue-600 transition duration-200 flex items-center justify-center">
                    <FaPaperPlane />
                </button>
            </form>
        </div>
    );
};

export default ChatArea;
