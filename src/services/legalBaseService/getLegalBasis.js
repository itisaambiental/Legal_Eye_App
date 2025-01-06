import server from "../../config/server.js";

/**
 * Retrieves all legal basis records.
 * Sends a GET request to the endpoint to fetch the data.
 *
 * @async
 * @function getLegalBasis
 * @param {Object} params - Parameters for the request.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array>} The list of legal basis records.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function getLegalBasis({ token }) {
    try {
        const response = await server.get('/legalBasis', {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        if (response.status !== 200) {
            throw new Error("Failed to retrieve legal basis");
        }

        return response.data.legalBasis; 

    } catch (error) {
        console.error(error);
        throw error;
    }
}
