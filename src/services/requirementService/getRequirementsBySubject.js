import server from "../../config/server.js";

/**
 * Retrieves requirements filtered by a specific subject.
 * Sends a GET request to fetch matching requirements.
 *
 * @async
 * @function getRequirementsBySubject
 * @param {Object} params - Parameters for the request.
 * @param {string} params.subjectId - The ID of the subject to filter by.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array<Object>>} - A list of requirements filtered by subject.
 * @throws {Error} - If the response status is not 200 or if there is an error with the request.
 */
export default async function getRequirementsBySubject({ subjectId, token }) {
  try {
    const response = await server.get(`/requirements/subject/${subjectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to retrieve requirements by subject");
    }

    const { requirements } = response.data;
    return requirements;
  } catch (error) {
    console.error("Error retrieving requirements by subject:", error);
    throw error;
  }
}
