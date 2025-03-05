/**
 * Configuration helper for your Next.js app on Vercel
 * This is a reference file that can be used in your Next.js application
 */

const crypto = require('crypto');

/**
 * Creates all the necessary headers for making authenticated requests to the API
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {string} path - API endpoint path
 * @param {object|null} body - Request body (if applicable)
 * @returns {object} - Headers object to include with fetch request
 */
const createSecureHeaders = (method, path, body = null) => {
  // Get API token from environment
  const apiToken = process.env.API_TOKEN;
  
  if (!apiToken) {
    throw new Error('API_TOKEN is not defined in environment variables');
  }
  
  // Create timestamp (milliseconds since epoch)
  const timestamp = Date.now().toString();
  
  // Create the string to sign
  const stringToSign = `${method}${path}${JSON.stringify(body) || ''}${timestamp}`;
  
  // Generate signature
  const signature = crypto
    .createHmac('sha256', apiToken)
    .update(stringToSign)
    .digest('hex');
  
  // Return headers object
  return {
    'Authorization': `Bearer ${apiToken}`,
    'Content-Type': 'application/json',
    'X-Request-Timestamp': timestamp,
    'X-Request-Signature': signature
  };
};

/**
 * Example of using the secure headers in a fetch request from Next.js
 * @param {string} endpoint - API endpoint
 * @param {object} data - Request data
 * @returns {Promise} - Fetch promise
 */
const secureApiRequest = async (endpoint, method = 'GET', data = null) => {
  const API_URL = process.env.API_URL || 'http://localhost:4000';
  const path = `/api${endpoint}`;
  const url = `${API_URL}${path}`;
  
  const headers = createSecureHeaders(method, path, data);
  
  const options = {
    method,
    headers,
    credentials: 'include',
  };
  
  if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
    options.body = JSON.stringify(data);
  }
  
  const response = await fetch(url, options);
  return await response.json();
};

module.exports = {
  createSecureHeaders,
  secureApiRequest
};

/**
 * IMPORTANT: This file should be used as a reference
 * Copy and modify it for use in your Next.js application on Vercel
 * 
 * In your Next.js app, set the environment variables:
 * 
 * API_TOKEN=2006adda (same as on your API server)
 * API_URL=https://your-api-url.com (your deployed API URL)
 * 
 * For server-side API calls in Next.js, you can use:
 * 
 * import { secureApiRequest } from '../utils/apiClient';
 * 
 * export async function getServerSideProps() {
 *   const data = await secureApiRequest('/users', 'GET');
 *   return { props: { data } };
 * }
 */