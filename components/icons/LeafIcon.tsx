
import React from 'react';

const LeafIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 14.121a5 5 0 01-7.07 0l-1.061-1.06a5 5 0 010-7.07l1.06-1.061a5 5 0 017.07 0l1.06 1.06a5 5 0 010 7.07l-1.06 1.061z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15" />
    </svg>
);

export default LeafIcon;
