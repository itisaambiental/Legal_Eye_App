import server from "../../config/server.js"

/**
 * Verifies a password reset code for a user based on their email.
 * Sends a POST request to verify the code sent to the user's email for password reset.
 * 
 * @async
 * @function sendNewPassword
 * @param {string} gmail - The user's email address associated with the password reset.
 * @param {string} code - The verification code for resetting the password.
 * 
 * @returns {Promise<boolean>} True if the response status is 200.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function sendNewPassword(gmail, code) {
    try {
        const response = await server.post('/user/verify-code', {
            gmail, 
            code
        })

        if (response.status !== 200) {
            throw new Error('Response is NOT ok')
        }

        return true
    } catch (error) {
        console.error(error)
        throw error
    }
}
