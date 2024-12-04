import server from "../../config/server.js";

/**
 * Retrieves legal basis records by subjectId and aspects.
 * Sends a GET request to the endpoint to fetch the legal basis data.
 *
 * @async
 * @function getLegalBasisBySubjectAndAspects
 * @param {Object} params - Parameters for the request.
 * @param {string} params.subjectId - The subjectId of the legal basis to retrieve (required).
 * @param {Array<string>} params.aspectIds - An array of aspect IDs to retrieve legal basis for (required).
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array>} The list of legal basis records matching the subjectId and aspects.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function getLegalBasisBySubjectAndAspects({ subjectId, aspectIds, token }) {
    try {
        const response = await server.get(`/legalBasis/aspects/subject`, {
            params: {
                subjectId: subjectId,
                aspectIds: aspectIds
            },
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        });

        if (response.status !== 200) {
            throw new Error("Failed to retrieve legal basis by subject and aspects");
        }

        return response.data.legalBasis;

    } catch (error) {
        console.error("Error retrieving legal basis by subject and aspects:", error);
        throw error;
    }
}
