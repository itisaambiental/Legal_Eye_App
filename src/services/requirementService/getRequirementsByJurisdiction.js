import server from "../../config/server.js";

/**
 * Retrieves requirements by their jurisdiction.
 * Sends a GET request to fetch matching requirements.
 *
 * @async
 * @function getRequirementsByJurisdiction
 * @param {Object} params - Parameters for the request.
 * @param {string} params.jurisdiction - The jurisdiction type to filter by.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array<Object>>} - A list of requirements matching the jurisdiction.
 * @throws {Error} - If the response status is not 200 or if there is an error with the request.
 */
export default async function getRequirementsByJurisdiction({ jurisdiction, token }) {
  try {
    const response = await server.get('/requirements/search/jurisdiction', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        jurisdiction,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to retrieve requirements by jurisdiction");
    }

    const { requirements } = response.data;
    return requirements;
  } catch (error) {
    console.error("Error retrieving requirements by jurisdiction:", error);
    throw error;
  }
}
