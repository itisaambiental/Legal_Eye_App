import server from "../../config/server.js";

/**
 * Retrieves legal basis records by subjectId and aspects.
 * Sends a GET request to the endpoint to fetch the legal basis data.
 *
 * @async
 * @function getLegalBasisBySubjectAndAspects
 * @param {Object} params - Parameters for the request.
 * @param {number} params.subjectId - The subjectId of the legal basis to retrieve (required).
 * @param {Array<number>} params.aspectsIds - An array of aspect IDs to retrieve legal basis for (required).
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array<Object>>} The list of legal basis records matching the subjectId and aspects.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function getLegalBasisBySubjectAndAspects({
  subjectId,
  aspectsIds,
  token,
}) {
  try {
    const response = await server.get(
      `/legalBasis/subject/${subjectId}/aspects`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          aspectIds: aspectsIds,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to retrieve legal basis by subject and aspects");
    }

    const { legalBasis } = response.data;
    return legalBasis;
  } catch (error) {
    console.error(
      "Error retrieving legal basis by subject and aspects:",
      error
    );
    throw error;
  }
}
