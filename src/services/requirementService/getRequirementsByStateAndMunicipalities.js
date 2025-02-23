import server from "../../config/server.js";

/**
 * Retrieves requirements by state and municipalities.
 * Sends a GET request to fetch matching requirements.
 *
 * @async
 * @function getRequirementsByStateAndMunicipalities
 * @param {Object} params - Parameters for the request.
 * @param {string} params.state - The state to filter by.
 * @param {Array<string>} params.municipalities - - An array of municipalities to retrieve legal basis for (required).
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array<Object>>} - A list of requirements matching the state and municipalities.
 * @throws {Error} - If the response status is not 200 or if there is an error with the request.
 */
export default async function getRequirementsByStateAndMunicipalities({ state, municipalities, token }) {
  try {
    const response = await server.get('/requirements/search/state/municipalities', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        state,
        municipalities, 
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to retrieve requirements by state and municipalities");
    }

    const { requirements } = response.data;
    return requirements;
  } catch (error) {
    console.error("Error retrieving requirements by state and municipalities:", error);
    throw error;
  }
}
