import server from "../../config/server.js";

/**
 * Retrieves legal basis records by state and municipalities.
 * Sends a GET request to the endpoint to fetch the legal basis data.
 *
 * @async
 * @function getLegalBasisByStateAndMunicipalities
 * @param {Object} params - Parameters for the request.
 * @param {string} params.state - The state of the legal basis to retrieve (required).
 * @param {Array<string>} params.municipalities - An array of municipalities to retrieve legal basis for (required).
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array>} The list of legal basis records matching the state and municipalities.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function getLegalBasisByStateAndMunicipalities({ state, municipalities, token }) {
    try {
        const response = await server.get(`/legalBasis/state/municipalities/query`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            params: {
                state: state,
                municipalities: municipalities
            }
        });
        if (response.status !== 200) {
            throw new Error("Failed to retrieve legal basis by state and municipalities");
        }

        return response.data.legalBasis;

    } catch (error) {
        console.error(error);
        throw error;
    }
}
