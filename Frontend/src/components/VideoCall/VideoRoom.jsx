import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Maximize } from 'lucide-react';
import useWebRTC from '../../hooks/useWebRTC'; // The custom "Engine" hook
import './VideoRoom.css';

const VideoRoom = ({ bookingId, onHangup }) => {
    // 1. Get the WebRTC logic from our custom hook
    const {
        localStream,
        remoteStream,
        isMuted,
        isCameraOff,
        toggleMute,
        toggleCamera,
        endCall
    } = useWebRTC(bookingId);

    // 2. Refs to attach the live video streams to HTML elements
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    // 3. Effect: Whenever a stream changes, attach it to the video tag
    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    return (
        <div className="video-conference-container">
            {/* REMOTE VIDEO (The Main Screen) */}
            <div className="remote-video-wrapper">
                <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="remote-video"
                />
                {!remoteStream && (
                    <div className="waiting-placeholder">
                        <p>Waiting for guest to join...</p>
                    </div>
                )}
            </div>

            {/* LOCAL VIDEO (The Miniature "Selfie" View) */}
            <div className="local-video-wrapper">
                <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted // CRITICAL: Always mute your own audio locally to prevent feedback loops!
                    className="local-video"
                />
            </div>

            {/* CONTROL BAR */}
            <div className="controls-bar">
                <button
                    onClick={toggleMute}
                    className={`control-btn ${isMuted ? 'off' : ''}`}
                >
                    {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                </button>

                <button
                    onClick={toggleCamera}
                    className={`control-btn ${isCameraOff ? 'off' : ''}`}
                >
                    {isCameraOff ? <VideoOff size={24} /> : <Video size={24} />}
                </button>

                <button
                    onClick={() => { endCall(); onHangup(); }}
                    className="control-btn hangup"
                >
                    <PhoneOff size={24} />
                </button>
            </div>
        </div>
    );
};

export default VideoRoom;