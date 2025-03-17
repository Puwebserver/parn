import React, { forwardRef } from 'react';

interface VideoPlayerProps {
    file: File;
}

// Forward ref to allow parent to control the video element
const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(({ file }, ref) => {
    return (
        <video
            ref={ref}
            controls
            src={URL.createObjectURL(file)}
            style={{ maxWidth: '600px', width: '100%', margin: '20px 0' }}
        />
    );
});

VideoPlayer.displayName = 'VideoPlayer'; // Required for forwardRef in TypeScript

export default VideoPlayer;
