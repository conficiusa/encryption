const crypto = require('crypto');

/**
 * Verifies the signature of incoming requests to ensure they came from our Vercel app
 * Uses HMAC SHA-256 verification
 */
class SignatureVerifier {
  /**
   * Verify request signature
   * @param {Object} req - Express request object
   * @param {string} timestamp - Request timestamp header
   * @param {string} signature - Request signature header
   * @returns {boolean} - Whether signature is valid
   */
  static verify(req, timestamp, signature) {
    // Check if timestamp is recent (within 5 minutes)
    const timestampDate = new Date(parseInt(timestamp));
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000); // 5 minutes ago
    
    if (timestampDate < fiveMinutesAgo) {
      return false; // Request is too old
    }
    
    // Create the string to sign
    const method = req.method;
    const path = req.originalUrl;
    const body = JSON.stringify(req.body) || '';
    
    const stringToSign = `${method}${path}${body}${timestamp}`;
    
    // Generate signature with the API token as the key
    const expectedSignature = crypto
      .createHmac('sha256', process.env.API_TOKEN)
      .update(stringToSign)
      .digest('hex');
    
    // Compare signatures using constant-time comparison (to prevent timing attacks)
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature)
    );
  }
}

module.exports = SignatureVerifier;