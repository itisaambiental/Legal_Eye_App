import server from "../../config/server.js";

/**
 * Retrieves requirements by their state.
 * Sends a GET request to fetch matching requirements.
 *
 * @async
 * @function getRequirementsByState
 * @param {Object} params - Parameters for the request.
 * @param {string} params.state - The state to filter by.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array<Object>>} - A list of requirements matching the state.
 * @throws {Error} - If the response status is not 200 or if there is an error with the request.
 */
export default async function getRequirementsByState({ state, token }) {
  try {
    const response = await server.get('/requirements/search/state', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        state,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to retrieve requirements by state");
    }

    const { requirements } = response.data;
    return requirements;
  } catch (error) {
    console.error("Error retrieving requirements by state:", error);
    throw error;
  }
}
