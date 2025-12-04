import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaPlus, FaHashtag, FaSignOutAlt, FaTrash } from 'react-icons/fa';

const Sidebar = ({ onSelectChannel, selectedChannel }) => {
    const [channels, setChannels] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newChannelName, setNewChannelName] = useState('');
    const { user, logout } = useAuth();

    useEffect(() => {
        fetchChannels();
    }, []);

    const fetchChannels = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('http://localhost:5000/api/channels', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setChannels(data);
        } catch (error) {
            console.error(error);
        }
    };

    const createChannel = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post('http://localhost:5000/api/channels', { name: newChannelName }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setChannels([...channels, data]);
            setShowCreateModal(false);
            setNewChannelName('');
        } catch (error) {
            alert('Failed to create channel');
        }
    };

    const deleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete('http://localhost:5000/api/auth/delete', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                logout();
            } catch (error) {
                console.error(error);
                alert('Failed to delete account');
            }
        }
    };

    return (
        <div className="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h1 className="font-bold text-xl">Mini Chat</h1>
                <button onClick={logout} className="text-gray-400 hover:text-white" title="Logout">
                    <FaSignOutAlt />
                </button>
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-gray-400 uppercase text-xs font-semibold">Channels</h2>
                    <button onClick={() => setShowCreateModal(true)} className="text-gray-400 hover:text-white">
                        <FaPlus />
                    </button>
                </div>
                <ul>
                    {channels.map(channel => (
                        <li key={channel._id} className="mb-1">
                            <button
                                onClick={() => onSelectChannel(channel)}
                                className={`flex items-center w-full px-2 py-1 rounded ${selectedChannel?._id === channel._id ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                            >
                                <FaHashtag className="mr-2 text-sm" />
                                <span className="truncate">{channel.name}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="p-4 border-t border-gray-700 bg-gray-800">
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-2">
                        {user?.username[0].toUpperCase()}
                    </div>
                    <div className="truncate font-semibold">{user?.username}</div>
                </div>
                <button onClick={deleteAccount} className="mt-2 text-red-400 hover:text-red-300 text-xs flex items-center">
                    <FaTrash className="mr-1" /> Delete Account
                </button>
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white text-black p-6 rounded shadow-lg w-80">
                        <h3 className="text-lg font-bold mb-4">Create Channel</h3>
                        <form onSubmit={createChannel}>
                            <input
                                type="text"
                                value={newChannelName}
                                onChange={(e) => setNewChannelName(e.target.value)}
                                placeholder="Channel Name"
                                className="w-full border p-2 rounded mb-4"
                                required
                            />
                            <div className="flex justify-end">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="mr-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
