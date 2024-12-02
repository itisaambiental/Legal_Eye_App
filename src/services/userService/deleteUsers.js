import server from "../../config/server.js"

/**
 * Deletes multiple users by their IDs.
 * Sends a batch DELETE request to the server with an array of user IDs and an authorization token.
 * 
 * @async
 * @function deleteUsers
 * @param {Object} params - Parameters for deleting users.
 * @param {Array<number>} params.userIds - An array of user IDs to delete.
 * @param {string} params.token - The authorization token for the request.
 * 
 * @returns {Promise<boolean>} Returns `true` if the users were deleted successfully.
 * @throws {Error} If the response status is not 204 or if there is an error with the request.
 */
export default async function deleteUsers({ userIds, token }) {
    try {
        const response = await server.delete('/users/batch', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            data: { userIds }
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
