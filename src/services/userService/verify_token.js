import server from "../../config/server.js"

/**
 * Verifies the validity of a provided JWT token.
 * Sends a POST request with the token in the request body to validate it on the server.
 * 
 * @async
 * @function verifyToken
 * @param {string} token - The JWT token to be verified.
 * 
 * @returns {Promise<boolean>} A boolean indicating whether the token is valid.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function verifyToken(token) {
    try {
        const response = await server.post('/user/verify/token', { token });

        if (response.status !== 200) {
            throw new Error('Response is NOT ok');
        }

        return response.data.valid;
    } catch (error) {
        console.error("Error verifying token:", error);
        throw error;
    }
}
