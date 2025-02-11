import server from "../../config/server.js";

/**
 * Retrieves an aspect by its ID.
 * Sends a GET request to the backend to fetch a specific aspect by ID.
 * 
 * @async
 * @function getAspectById
 * @param {Object} params - Parameters for retrieving the aspect.
 * @param {number} params.aspectId - The ID of the aspect to retrieve.
 * @param {string} params.token - The authorization token for the request.
 * 
 * @returns {Promise<Object>} The aspect data returned from the server.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function getAspectById({ aspectId, token }) {
    try {
        const response = await server.get(`/aspect/${aspectId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        if (response.status !== 200) {
            throw new Error('Failed to retrieve aspect');
        }
        const { aspect } = response.data;
        return aspect;
    } catch (error) {
        console.error("Error retrieving aspect by ID:", error);
        throw error;
    }
}
