import server from "../../config/server.js";

/**
 * Retrieves requirements by their acceptance criteria.
 * Sends a GET request to fetch matching requirements.
 *
 * @async
 * @function getRequirementsByAcceptanceCriteria
 * @param {Object} params - Parameters for the request.
 * @param {string} params.description - The acceptance criteria or partial match.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array<Object>>} - A list of requirements matching the description.
 * @throws {Error} - If the response status is not 200 or if there is an error with the request.
 */
export default async function getRequirementsByAcceptanceCriteria({ acceptanceCriteria, token }) {
  try {
    const response = await server.get('/requirements/search/acceptance-criteria', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        acceptanceCriteria,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to retrieve requirements by acceptance criteria");
    }

    const { requirements } = response.data;
    return requirements;
  } catch (error) {
    console.error("Error retrieving requirements by acceptance criteria:", error);
    throw error;
  }
}
