import server from "../../config/server.js";

/**
 * Retrieves requirements by their periodicity.
 * Sends a GET request to fetch matching requirements.
 *
 * @async
 * @function getRequirementsByPeriodicity
 * @param {Object} params - Parameters for the request.
 * @param {string} params.periodicity - The periodicity type (e.g., "Anual", "2 años", "Por evento", "Única vez").
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array<Object>>} - A list of requirements matching the periodicity.
 * @throws {Error} - If the response status is not 200 or if there is an error with the request.
 */
export default async function getRequirementsByPeriodicity({ periodicity, token }) {
  try {
    const response = await server.get('/requirements/search/periodicity', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        periodicity,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to retrieve requirements by periodicity");
    }

    const { requirements } = response.data;
    return requirements;
  } catch (error) {
    console.error("Error retrieving requirements by periodicity:", error);
    throw error;
  }
}
