import { useEffect, useRef, useState, useCallback } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Free Google STUN servers to find public IP addresses
const iceConfig = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
    ]
};

const useWebRTC = (bookingId) => {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);

    const socketRef = useRef(null);
    const peerRef = useRef(null);

    // Initialize WebRTC Peer Connection
    const createPeer = useCallback(() => {
        const peer = new RTCPeerConnection(iceConfig);

        // When we find a "path" (ICE candidate), send it to the other person via socket
        peer.onicecandidate = (event) => {
            if (event.candidate) {
                socketRef.current.emit('ice-candidate', {
                    targetRoom: bookingId,
                    candidate: event.candidate
                });
            }
        };

        // When the other person's video arrives, add it to our state
        peer.ontrack = (event) => {
            setRemoteStream(event.streams[0]);
        };

        return peer;
    }, [bookingId]);

    useEffect(() => {
        // 1. Connect to Signaling Server
        socketRef.current = io(SOCKET_URL);
        socketRef.current.emit('join-room', bookingId);

        // 2. Get Camera & Microphone
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                setLocalStream(stream);

                // 3. Setup Peer Connection
                peerRef.current = createPeer();

                // Add our video/audio tracks to the peer connection
                stream.getTracks().forEach(track => {
                    peerRef.current.addTrack(track, stream);
                });

                // SIGNALING LOGIC

                // When a user joins, create an Offer
                socketRef.current.on('user-joined', async () => {
                    const offer = await peerRef.current.createOffer();
                    await peerRef.current.setLocalDescription(offer);
                    socketRef.current.emit('offer', { targetRoom: bookingId, offer });
                });

                // When we receive an Offer, create an Answer
                socketRef.current.on('offer', async ({ offer }) => {
                    await peerRef.current.setRemoteDescription(new RTCSessionDescription(offer));
                    const answer = await peerRef.current.createAnswer();
                    await peerRef.current.setLocalDescription(answer);
                    socketRef.current.emit('answer', { targetRoom: bookingId, answer });
                });

                // When we receive an Answer, finish the handshake
                socketRef.current.on('answer', async ({ answer }) => {
                    await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
                });

                // When we receive a candidate, add it to the connection
                socketRef.current.on('ice-candidate', async ({ candidate }) => {
                    if (peerRef.current) {
                        await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                    }
                });
            })
            .catch(err => console.error('Error accessing media:', err));

        // Cleanup on disconnect
        return () => {
            if (localStream) localStream.getTracks().forEach(track => track.stop());
            if (socketRef.current) socketRef.current.disconnect();
            if (peerRef.current) peerRef.current.close();
        };
    }, [bookingId, createPeer]);

    // CONTROLS
    const toggleMute = () => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
            setIsMuted(!audioTrack.enabled);
        }
    };

    const toggleCamera = () => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled;
            setIsCameraOff(!videoTrack.enabled);
        }
    };

    const endCall = () => {
        if (localStream) localStream.getTracks().forEach(track => track.stop());
        if (socketRef.current) socketRef.current.disconnect();
        if (peerRef.current) peerRef.current.close();
    };

    return {
        localStream,
        remoteStream,
        isMuted,
        isCameraOff,
        toggleMute,
        toggleCamera,
        endCall
    };
};

export default useWebRTC;
