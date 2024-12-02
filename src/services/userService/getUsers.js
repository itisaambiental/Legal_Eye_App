import server from "../../config/server.js"

/**
 * Fetches a list of all users from the server.
 * Sends a GET request to retrieve all users, using an authorization token.
 * 
 * @async
 * @function getUsers
 * @param {Object} params - Parameters for fetching users.
 * @param {string} params.token - The authorization token for the request.
 * 
 * @returns {Promise<Array<Object>>} A list of all users retrieved from the server.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function getUsers({ token }) {
    try {
        const response = await server.get('/users/', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if (response.status !== 200) {
            throw new Error('Response is NOT ok')
        }

        const { users } = response.data
        return users  
    } catch (error) {
        console.error(error)
        throw error
    }
}
