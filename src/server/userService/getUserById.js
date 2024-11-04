import server from "../config/server"

/**
 * Fetches a user by their ID from the server.
 * Sends a GET request to retrieve the user's details, using an authorization token.
 * 
 * @async
 * @function getUserById
 * @param {Object} params - Parameters for fetching the user.
 * @param {number} params.id - The ID of the user to retrieve.
 * @param {string} params.token - The authorization token for the request.
 * 
 * @returns {Promise<Object>} The user object retrieved from the server.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function getUserById({ id, token }) {
    try {
        const response = await server.get(`/user/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if (response.status !== 200) {
            throw new Error('Response is NOT ok')
        }

        const { user } = response.data
        return user

    } catch (error) {
        console.error(error)
        throw error
    }
}
