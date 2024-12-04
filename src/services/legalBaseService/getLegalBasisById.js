import server from "../../config/server.js";

/**
 * Retrieves a specific legal basis by its ID from the backend.
 * Sends a GET request to the endpoint to fetch the legal basis data.
 *
 * @async
 * @function getLegalBasisById
 * @param {Object} params - Parameters for the request.
 * @param {string} params.legalBaseId - The ID of the legal basis to retrieve.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Object>} The legal basis data returned from the server.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function getLegalBasisById({ legalBaseId, token }) {
    try {
        const response = await server.get(`/legalBasis/${legalBaseId}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        });

        if (response.status !== 200) {
            throw new Error("Failed to retrieve legal basis");
        }

        return response.data.legalBasis; 

    } catch (error) {
        console.error("Error retrieving legal basis by ID:", error);
        throw error;
    }
}
