import server from "../../config/server.js"

/**
 * Deletes a user by their ID.
 * Sends a DELETE request to the server with the user's ID and authorization token.
 * 
 * @async
 * @function deleteUserById
 * @param {Object} params - Parameters for deleting a user.
 * @param {number} params.id - The ID of the user to delete.
 * @param {string} params.token - The authorization token for the request.
 * 
 * @returns {Promise<boolean>} Returns `true` if the user was deleted successfully.
 * @throws {Error} If the response status is not 204 or if there is an error with the request.
 */
export default async function deleteUserById({ id, token }) {
    try {
        const response = await server.delete(`/user/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (response.status !== 204) {
            throw new Error('Response is NOT ok')
        }

        return true

    } catch (error) {
        console.error(error)
        throw error
    }
}
