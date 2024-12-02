import server from "../../config/server.js"

/**
 * Deletes an aspect by its ID.
 * Sends a DELETE request to remove an aspect from the backend.
 * 
 * @async
 * @function deleteAspect
 * @param {Object} params - Parameters for deleting an aspect.
 * @param {number} params.aspectId - The ID of the aspect to delete.
 * @param {string} params.token - The authorization token for the request.
 * 
 * @returns {Promise<void>} Resolves if deletion is successful.
 * @throws {Error} If the response status is not 204 or if there is an error with the request.
 */
export default async function deleteAspect({ aspectId, token }) {
    try {
        const response = await server.delete(`/aspect/${aspectId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })

        if (response.status !== 204) {
            throw new Error('Failed to delete aspect')
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}
