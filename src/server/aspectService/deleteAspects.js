import server from "../config/server"

/**
 * Deletes multiple aspects by their IDs.
 * Sends a batch DELETE request to the server with an array of aspect IDs and an authorization token.
 * 
 * @async
 * @function deleteAspects
 * @param {Object} params - Parameters for deleting aspects.
 * @param {Array<number>} params.aspectIds - An array of aspect IDs to delete.
 * @param {string} params.token - The authorization token for the request.
 * 
 * @returns {Promise<boolean>} Returns `true` if the aspects were deleted successfully.
 * @throws {Error} If the response status is not 204 or if there is an error with the request.
 */
export default async function deleteAspects({ aspectIds, token }) {
    try {
        const response = await server.delete('/aspects/batch', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            data: { aspectIds }
        });

        if (response.status !== 204) {
            throw new Error('Response is NOT ok');
        }

        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
