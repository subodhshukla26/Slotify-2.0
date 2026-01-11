# Slotify Backend

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the `Backend` directory with the following variables:

```env
# Server Configuration
PORT=8000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
MONGO_URI=your_mongodb_connection_string

# Session
SESSION_SECRET=your_random_session_secret_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
```

**Important Notes:**
- Backend runs on port 8000
- Update your Google OAuth redirect URI in Google Cloud Console to: `http://localhost:8000/auth/google/callback`
- Generate a secure random string for `SESSION_SECRET` (e.g., use `openssl rand -base64 32`)

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

### 4. Verify Setup

- Server should start on `http://localhost:8000`
- Health check: `http://localhost:8000/health`
- Google OAuth: `http://localhost:8000/auth/google`

## Troubleshooting

### Port 5000 Already in Use
If you see errors about port 5000, it's likely macOS AirPlay Receiver. The default port is now 5001. You can also:
- Disable AirPlay Receiver in System Settings > General > AirDrop & Handoff
- Or set `PORT=3000` in your `.env` file

### 403 Forbidden Errors
- Make sure CORS is properly configured
- Check that your frontend URL matches `CLIENT_URL` in `.env`
- Verify Google OAuth credentials are set correctly

