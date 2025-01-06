import server from "../../config/server.js";

/**
 * Retrieves legal basis records by their classification.
 * Sends a GET request to the endpoint to fetch the legal basis data.
 *
 * @async
 * @function getLegalBasisByClassification
 * @param {Object} params - Parameters for the request.
 * @param {string} params.classification - The classification of the legal basis to retrieve.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array>} The list of legal basis records matching the classification.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function getLegalBasisByClassification({ classification, token }) {
    try {
        const response = await server.get('/legalBasis/classification/classification', {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            params: {
                classification: classification, 
            },
        });

        if (response.status !== 200) {
            throw new Error("Failed to retrieve legal basis by classification");
        }

        return response.data.legalBasis;

    } catch (error) {
        console.error(error);
        throw error;
    }
}
