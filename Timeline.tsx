import React from 'react';

interface TimelineProps {
    duration: number;
    trimRange: [number, number];
    onTrimChange: (start: number, end: number) => void;
}

const Timeline: React.FC<TimelineProps> = ({ duration, trimRange, onTrimChange }) => {
    const [start, end] = trimRange;

    // Handle start time change
    const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStart = Math.min(parseFloat(e.target.value), end);
        onTrimChange(newStart, end);
    };

    // Handle end time change
    const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEnd = Math.max(parseFloat(e.target.value), start);
        onTrimChange(start, newEnd);
    };

    return (
        <div className="timeline">
            <label style={{ marginRight: '20px' }}>
                Start (s): 
                <input
                    type="range"
                    min="0"
                    max={duration}
                    step="0.1"
                    value={start}
                    onChange={handleStartChange}
                />
                <span>{start.toFixed(1)}</span>
            </label>
            <label>
                End (s): 
                <input
                    type="range"
                    min="0"
                    max={duration}
                    step="0.1"
                    value={end}
                    onChange={handleEndChange}
                />
                <span>{end.toFixed(1)}</span>
            </label>
        </div>
    );
};

export default Timeline;
