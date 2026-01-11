const formatUser = (user) => {
  if (!user) return null;
  const plainUser = typeof user.toObject === "function" ? user.toObject() : user;
  return {
    id: plainUser._id?.toString() || plainUser.id,
    name: plainUser.name,
    email: plainUser.email,
    avatar: plainUser.avatar,
    timezone: plainUser.timezone,
    googleId: plainUser.googleId,
  };
};

export const getCurrentUser = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.json({ user: formatUser(req.user) });
};

export const getAuthStatus = (req, res) => {
  res.json({
    authenticated: Boolean(req.user),
    user: req.user ? formatUser(req.user) : null,
  });
};

export const logoutUser = (req, res, next) => {
  req.logout((logoutError) => {
    if (logoutError) {
      return next(logoutError);
    }

    req.session?.destroy((sessionError) => {
      if (sessionError) {
        return next(sessionError);
      }

      res.clearCookie("connect.sid", {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
      });
      res.status(200).json({ message: "Logged out" });
    });
  });
};

