import server from "../../config/server.js"

/**
 * Logs in a user through Microsoft authentication.
 * Sends a POST request with the Microsoft access token to authenticate the user.
 * 
 * @async
 * @function login_user_microsoft
 * @param {Object} params - Parameters for Microsoft login.
 * @param {string} params.accessToken - The Microsoft access token for authentication.
 * 
 * @returns {Promise<Object>} An object containing the user's JWT token.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function login_user_microsoft({ accessToken }) {
    try {
        const response = await server.post('/user/login/auth/microsoft', {
            accessToken
        })

        if (response.status !== 200) {
            throw new Error('Response is NOT ok')
        }

        const { token } = response.data
        return { token }

    } catch (error) {
        console.error(error)
        throw error
    }
}
