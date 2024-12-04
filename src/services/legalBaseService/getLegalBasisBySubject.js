import server from "../../config/server.js";

/**
 * Retrieves legal basis records by subjectId.
 * Sends a GET request to the endpoint to fetch the legal basis data.
 *
 * @async
 * @function getLegalBasisBySubject
 * @param {Object} params - Parameters for the request.
 * @param {string} params.subjectId - The subjectId to retrieve legal basis for (required).
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array>} The list of legal basis records matching the subjectId.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function getLegalBasisBySubject({ subjectId, token }) {
    try {
        const response = await server.get(`/legalBasis/subject/${encodeURIComponent(subjectId)}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        });

        if (response.status !== 200) {
            throw new Error("Failed to retrieve legal basis by subject");
        }

        return response.data.legalBasis;

    } catch (error) {
        console.error("Error retrieving legal basis by subject:", error);
        throw error;
    }
}
