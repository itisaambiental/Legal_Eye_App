import server from "../config/server"

/**
 * Deletes a subject by its ID.
 * Sends a DELETE request to the /subject/:id endpoint.
 * 
 * @async
 * @function deleteSubject
 * @param {Object} params - Parameters for deleting a subject.
 * @param {string} params.id - The ID of the subject to delete.
 * @param {string} params.token - The authorization token for the request.
 * 
 * @returns {Promise<void>} Resolves if deletion was successful.
 * @throws {Error} If the response status is not 204 or if there is an error with the request.
 */
export default async function deleteSubject({ id, token }) {
    try {
        const response = await server.delete(`/subject/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })

        if (response.status !== 204) {
            throw new Error('Failed to delete subject')
        }

    } catch (error) {
        console.error(error)
        throw error
    }
}
