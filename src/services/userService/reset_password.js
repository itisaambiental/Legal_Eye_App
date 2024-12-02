import server from "../../config/server.js"

/**
 * Initiates a password reset for a user based on their email.
 * Sends a POST request to trigger the password reset process.
 * 
 * @async
 * @function resetPassword
 * @param {string} gmail - The user's email address for initiating the password reset.
 * 
 * @returns {Promise<number>} The response status code (200 if successful).
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function resetPassword(gmail) {
    try {
        const response = await server.post('/user/reset-password', {
            gmail,
        })

        if (response.status !== 200) {
            throw new Error('Response is NOT ok')
        }

        return response.status

    } catch (error) {
        console.error(error)
        throw error
    }
}
