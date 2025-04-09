const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const jwtAuthWithRefresh = (req, res, next) => {
    const accessToken = req.headers['authorization'];
    const refreshToken = req.headers['x-refresh-token'];

    if (!accessToken) return res.status(401).json({ success: false, err: 'Access token missing' });

    // Step 1: Try verifying access token
    jwt.verify(accessToken, JWT_SECRET, (err, decoded) => {
        if (!err) {
            req.user = decoded;
            return next(); // Access token is valid
        }

        if (err.name !== 'TokenExpiredError') {
            return res.status(403).json({ success: false, err: 'Invalid access token' });
        }

        // Step 2: Access token expired, try refresh token
        if (!refreshToken) return res.status(401).json({ success: false, err: 'Refresh token missing' });

        jwt.verify(refreshToken, JWT_REFRESH_SECRET, (refreshErr, refreshDecoded) => {
            if (refreshErr) {
                return res.status(403).json({ success: false, err: 'Refresh token expired or invalid' });
            }

            // Step 3: Generate new access token
            const newAccessToken = jwt.sign(
                { userId: refreshDecoded.userId },
                JWT_SECRET,
                { expiresIn: '15m' }
            );

            // Optional: Send new access token in response headers
            res.setHeader('x-new-access-token', newAccessToken);
            req.user = { userId: refreshDecoded.userId };
            next();
        });
    });
};

module.exports = {
    jwtAuthWithRefresh
};
