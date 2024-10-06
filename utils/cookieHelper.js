exports.setAuthCookie = (h, token) => {
  h.state('token', token, {
    ttl: 24 * 60 * 60 * 1000, // 1 day expiration
    isSecure: process.env.NODE_ENV === 'production', // Secure in production
    isHttpOnly: true, // HTTP only for security
    path: '/', // Cookie valid across the entire site
  });
};
