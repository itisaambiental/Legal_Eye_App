import server from "../../config/server.js";

/**
 * Retrieves legal basis records by their jurisdiction.
 * Sends a GET request to the endpoint to fetch the legal basis data.
 *
 * @async
 * @function getLegalBasisByJurisdiction
 * @param {Object} params - Parameters for the request.
 * @param {string} params.jurisdiction - The jurisdiction of the legal basis to retrieve.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array>} The list of legal basis records matching the jurisdiction.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function getLegalBasisByJurisdiction({ jurisdiction, token }) {
    try {
        const response = await server.get('/legalBasis/jurisdiction/jurisdiction', {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            params: {
                jurisdiction: jurisdiction, 
            },
        });

        if (response.status !== 200) {
            throw new Error("Failed to retrieve legal basis by jurisdiction");
        }

        return response.data.legalBasis;

    } catch (error) {
        console.error(error);
        throw error;
    }
}
