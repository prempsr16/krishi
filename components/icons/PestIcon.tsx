import React from 'react';

const PestIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a2 2 0 00-2 2v1H8a2 2 0 00-2 2v1a10.003 10.003 0 0016 0v-1a2 2 0 00-2-2h-2V4a2 2 0 00-2-2zm0 18a8 8 0 100-16 8 8 0 000 16z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12l2 2m-2-2l-2 2m2-2V8m0 4h.01M8 17h8" />
    </svg>
);

export default PestIcon;