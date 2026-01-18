import React from 'react';

interface TargetCornersProps {
    className?: string;
    color?: string;
}

const TargetCorners: React.FC<TargetCornersProps> = ({
    className = "",
    color = "currentColor"
}) => {
    return (
        <div className={`absolute inset-0 pointer-events-none ${className}`}>
            {/* Top Left */}
            <div
                className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 rounded-tl-sm"
                style={{ borderColor: color }}
            />
            {/* Top Right */}
            <div
                className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 rounded-tr-sm"
                style={{ borderColor: color }}
            />
            {/* Bottom Left */}
            <div
                className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 rounded-bl-sm"
                style={{ borderColor: color }}
            />
            {/* Bottom Right */}
            <div
                className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 rounded-br-sm"
                style={{ borderColor: color }}
            />
        </div>
    );
};

export default TargetCorners;
