import React from 'react';

const TractorIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M8 12a4 4 0 11-8 0 4 4 0 018 0zM16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 19l2-7h-4l-2 7" />
    </svg>
);

export default TractorIcon;