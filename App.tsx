import React, { useState, useRef, useEffect } from 'react';
import VideoPlayer from './components/VideoPlayer';
import Timeline from './components/Timeline';
import Toolbar from './components/Toolbar';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

// Initialize FFmpeg instance
const ffmpeg = new FFmpeg();

const App: React.FC = () => {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [trimRange, setTrimRange] = useState<[number, number]>([0, 0]);
    const [duration, setDuration] = useState<number>(0);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Load FFmpeg.wasm when the app mounts
    useEffect(() => {
        const loadFFmpeg = async () => {
            try {
                await ffmpeg.load();
                console.log('FFmpeg loaded successfully');
            } catch (err) {
                console.error('Failed to load FFmpeg:', err);
            }
        };
        loadFFmpeg();
    }, []);

    // Handle video upload and set initial trim range
    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setVideoFile(file);
            const videoElement = videoRef.current;
            if (videoElement) {
                videoElement.onloadedmetadata = () => {
                    setDuration(videoElement.duration);
                    setTrimRange([0, videoElement.duration]);
                };
            }
        }
    };

    // Update trim range from the timeline component
    const handleTrimChange = (start: number, end: number) => {
        setTrimRange([start, end]);
        if (videoRef.current) {
            videoRef.current.currentTime = start;
        }
    };

    // Export trimmed video using FFmpeg
    const handleExport = async () => {
        if (!videoFile || !ffmpeg.loaded) {
            alert('No video loaded or FFmpeg not ready!');
            return;
        }

        const [start, end] = trimRange;
        const trimDuration = end - start;

        try {
            // Write the input file to FFmpeg's virtual filesystem
            await ffmpeg.writeFile('input.mp4', await fetchFile(videoFile));

            // Run FFmpeg trim command
            await ffmpeg.exec([
                '-i', 'input.mp4',
                '-ss', `${start}`, // Start time
                '-t', `${trimDuration}`, // Duration to trim
                '-c:v', 'copy', // Copy video codec (faster)
                '-c:a', 'copy', // Copy audio codec
                'output.mp4'
            ]);

            // Read the output file and trigger download
            const data = await ffmpeg.readFile('output.mp4');
            const blob = new Blob([data.buffer], { type: 'video/mp4' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'trimmed_video.mp4';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Export failed:', err);
            alert('Failed to export video. Check console for details.');
        }
    };

    return (
        <div className="app">
            <h1>Video Editor</h1>
            <input
                type="file"
                accept="video/*"
                onChange={handleUpload}
                style={{ margin: '20px 0' }}
            />
            {videoFile && (
                <>
                    <VideoPlayer file={videoFile} ref={videoRef} />
                    <Timeline
                        duration={duration}
                        trimRange={trimRange}
                        onTrimChange={handleTrimChange}
                    />
                    <Toolbar onExport={handleExport} />
                </>
            )}
        </div>
    );
};

export default App;
