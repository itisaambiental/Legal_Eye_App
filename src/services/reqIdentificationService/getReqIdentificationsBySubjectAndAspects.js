import server from "../../config/server.js";

/**
 * Retrieves requirement identifications filtered by subject ID and aspect IDs.
 *
 * @async
 * @function getReqIdentificationsBySubjectAndAspects
 * @param {Object} params - Parameters for the request.
 * @param {number} params.subjectId - ID of the subject.
 * @param {number[]} params.aspectIds - Array of aspect IDs.
 * @param {string} params.token - Authorization token.
 *
 * @returns {Promise<Object[]>} - An array of matching requirement identifications.
 * @throws {Error} - If the request fails or the response status is not 200.
 */
export default async function getReqIdentificationsBySubjectAndAspects({
  subjectId,
  aspectIds,
  token,
}) {
  try {
    const response = await server.get(
      `/req-identification/search/subject/${subjectId}/aspects`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          aspectIds,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(
        "Failed to fetch requirement identifications by subject and aspects"
      );
    }

    const { reqIdentifications } = response.data;
    return reqIdentifications;
  } catch (error) {
    console.error(
      "Error fetching requirement identifications by subject and aspects:",
      error
    );
    throw error;
  }
}
