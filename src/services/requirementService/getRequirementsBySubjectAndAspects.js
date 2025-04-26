import server from "../../config/server.js";

/**
 * Retrieves requirements filtered by a specific subject and optionally by aspects.
 * Sends a GET request to fetch matching requirements.
 *
 * @async
 * @function getRequirementsBySubjectAndAspects
 * @param {Object} params - Parameters for the request.
 * @param {number} params.subjectId - The ID of the subject to filter by.
 * @param {Array<number>} [params.aspectsIds] - Optional array of aspect IDs to further filter the requirements.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array<Object>>} - A list of requirements filtered by subject and optionally by aspects.
 * @throws {Error} - If the response status is not 200 or if there is an error with the request.
 */
export default async function getRequirementsBySubjectAndAspects({
  subjectId,
  aspectsIds,
  token,
}) {
  try {
    const response = await server.get(
      `/requirements/subject/${subjectId}/aspects`,
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
      throw new Error("Failed to retrieve requirements by subject and aspects");
    }

    const { requirements } = response.data;
    return requirements;
  } catch (error) {
    console.error(
      "Error retrieving requirements by subject and aspects:",
      error
    );
    throw error;
  }
}
