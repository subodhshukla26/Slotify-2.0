export const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    
    // Ensure CORS headers are set on 401 responses
    const origin = req.headers.origin;
    if (origin) {
        res.header("Access-Control-Allow-Origin", origin);
        res.header("Access-Control-Allow-Credentials", "true");
    }
    
    return res.status(401).json({ message: "Unauthorized" });
};