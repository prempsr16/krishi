
import React from 'react';

const VolumeUpIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 3.12a1 1 0 00-1 .984v11.792a1 1 0 001.555.832l6.179-4.12a1 1 0 000-1.664l-6.179-4.12A1 1 0 0010 3.12zM3.636 7.636a1 1 0 000 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 0zM2.222 9.05a1 1 0 000 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 0z" />
    </svg>
);

export default VolumeUpIcon;