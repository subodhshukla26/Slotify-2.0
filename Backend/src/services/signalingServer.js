import { Server } from 'socket.io';

const initSignalingServer = (server, corsOptions) => {
    const io = new Server(server, {
        cors: corsOptions
    });

    io.on('connection', (socket) => {
        console.log('👤 User connected to signaling:', socket.id);

        // 1. User joins a specific booking room
        socket.on('join-room', (bookingId) => {
            socket.join(bookingId);
            console.log(`🏠 User ${socket.id} joined booking room: ${bookingId}`);

            // Notify others in the room that someone joined
            socket.to(bookingId).emit('user-joined', socket.id);
        });

        // 2. Relay WebRTC Offer (from Host to Guest or vice-versa)
        socket.on('offer', ({ targetRoom, offer }) => {
            socket.to(targetRoom).emit('offer', { sender: socket.id, offer });
        });

        // 3. Relay WebRTC Answer
        socket.on('answer', ({ targetRoom, answer }) => {
            socket.to(targetRoom).emit('answer', { sender: socket.id, answer });
        });

        // 4. Relay ICE Candidates (Network connection helper)
        socket.on('ice-candidate', ({ targetRoom, candidate }) => {
            socket.to(targetRoom).emit('ice-candidate', { sender: socket.id, candidate });
        });

        socket.on('disconnect', () => {
            console.log('👤 User disconnected');
        });
    });

    return io;
};

export default initSignalingServer;