const { UnauthenticatedError, ForbiddenError } = require('../utils/errors');
const SignatureVerifier = require('../utils/signatureVerifier');

const authenticateToken = (req, res, next) => {
    // Check for token
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        throw new UnauthenticatedError('Authentication token is required');
    }

    // Verify token
    if (token.trim() !== process.env.API_TOKEN.trim()) {
        throw new UnauthenticatedError('Invalid authentication token');
    }

    // // Get request timestamp and signature 
    // const timestamp = req.headers['x-request-timestamp'];
    // const signature = req.headers['x-request-signature'];

    // // Verify request signature if we're in production
    // if (process.env.NODE_ENV === 'production') {
    //     // Skip signature check for development but require for production
    //     if (!timestamp || !signature) {
    //         throw new UnauthenticatedError('Request timestamp and signature are required');
    //     }

    //     // Verify signature
    //     const isValidSignature = SignatureVerifier.verify(req, timestamp, signature);
    //     if (!isValidSignature) {
    //         throw new UnauthenticatedError('Invalid request signature');
    //     }
    // }

    // Check for valid origin if in production


    next();
};

module.exports = authenticateToken;