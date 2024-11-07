import server from "../config/server"

/**
 * Updates an aspect's information by its ID.
 * Sends a PATCH request to update an aspect.
 * 
 * @async
 * @function updateAspect
 * @param {Object} params - Parameters for updating an aspect.
 * @param {number} params.aspectId - The ID of the aspect to update.
 * @param {string} params.aspectName - The new name for the aspect.
 * @param {string} params.token - The authorization token for the request.
 * 
 * @returns {Promise<Object>} The updated aspect data returned from the server.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function updateAspect({ aspectId, aspectName, token }) {
    try {
        const response = await server.patch(`/aspect/${aspectId}`, 
            { aspectName }, 
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }
        )

        if (response.status !== 200) {
            throw new Error('Failed to update aspect')
        }

        return response.data.updatedAspect

    } catch (error) {
        console.error(error)
        throw error
    }
}
