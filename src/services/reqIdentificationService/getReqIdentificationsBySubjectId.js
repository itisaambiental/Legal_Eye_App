import server from "../../config/server.js";

/**
 * Retrieves requirement identifications filtered by subject ID.
 *
 * @async
 * @function getReqIdentificationsBySubjectId
 * @param {Object} params - Parameters for the request.
 * @param {number} params.subjectId - ID of the subject to filter by.
 * @param {string} params.token - Authorization token.
 *
 * @returns {Promise<Object[]>} - An array of requirement identifications for the given subject.
 * @throws {Error} - If the request fails or the response status is not 200.
 */
export default async function getReqIdentificationsBySubjectId({
  subjectId,
  token,
}) {
  try {
    const response = await server.get(
      `/req-identification/search/subject/${subjectId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(
        "Failed to fetch requirement identifications by subject ID"
      );
    }

    const { reqIdentifications } = response.data;
    return reqIdentifications;  
  } catch (error) {
    console.error(
      "Error fetching requirement identifications by subject ID:",
      error
    );
    throw error;
  }
}
