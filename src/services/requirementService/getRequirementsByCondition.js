import server from "../../config/server.js";

/**
 * Retrieves requirements by their condition.
 * Sends a GET request to fetch matching requirements.
 *
 * @async
 * @function getRequirementsByCondition
 * @param {Object} params - Parameters for the request.
 * @param {string} params.condition - The condition type (e.g., "Crítica", "Operativa", "Recomendación", "Pendiente").
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array<Object>>} - A list of requirements matching the condition.
 * @throws {Error} - If the response status is not 200 or if there is an error with the request.
 */
export default async function getRequirementsByCondition({ condition, token }) {
  try {
    const response = await server.get('/requirements/search/condition', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        condition,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to retrieve requirements by condition");
    }

    const { requirements } = response.data;
    return requirements;
  } catch (error) {
    console.error("Error retrieving requirements by condition:", error);
    throw error;
  }
}
