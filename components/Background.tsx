import React from 'react';

const Background: React.FC = () => {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden">
            <div className="absolute top-0 -left-1/4 w-full h-full bg-gradient-to-r from-gray-900/30 to-transparent opacity-20 animate-pulse-slow rounded-full transform -rotate-45" style={{ filter: 'blur(100px)' }}></div>
            <div className="absolute bottom-0 -right-1/4 w-full h-full bg-gradient-to-l from-gray-800/30 to-transparent opacity-20 animate-pulse-slower rounded-full transform rotate-45" style={{ filter: 'blur(100px)' }}></div>
            <div className="absolute top-1/2 left-1/2 w-[200%] h-[100%] bg-gradient-to-r from-gray-900/10 via-gray-800/10 to-transparent opacity-15 animate-move-haze" style={{ filter: 'blur(100px)' }}></div>
        </div>
    );
};

export default Background;