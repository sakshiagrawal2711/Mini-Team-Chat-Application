const MessageBubble = ({ message, isOwn }) => {
    const time = new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className={`flex mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            {!isOwn && (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2 text-xs font-bold text-gray-700 flex-shrink-0">
                    {message.sender.username ? message.sender.username[0].toUpperCase() : '?'}
                </div>
            )}
            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg shadow ${isOwn ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                {!isOwn && <div className="text-xs font-bold mb-1 text-gray-600">{message.sender.username}</div>}
                <p className="break-words">{message.content}</p>
                <div className={`text-xs mt-1 text-right ${isOwn ? 'text-blue-200' : 'text-gray-500'}`}>
                    {time}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
