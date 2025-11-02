import React from 'react';

const YieldIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10a4 4 0 014-4h4a4 4 0 014 4v4a4 4 0 01-4 4h-4a4 4 0 01-4-4v-4z" />
    </svg>
);

export default YieldIcon;