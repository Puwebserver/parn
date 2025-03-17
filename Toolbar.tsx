import React from 'react';

interface ToolbarProps {
    onExport: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onExport }) => {
    return (
        <div className="toolbar">
            <button onClick={onExport}>Export Video</button>
        </div>
    );
};

export default Toolbar;
