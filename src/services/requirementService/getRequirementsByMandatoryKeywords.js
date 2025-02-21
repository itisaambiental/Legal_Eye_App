import server from "../../config/server.js";

/**
 * Retrieves requirements by their mandatory keywords.
 * Sends a GET request to fetch matching requirements.
 *
 * @async
 * @function getRequirementsByMandatoryKeywords
 * @param {Object} params - Parameters for the request.
 * @param {string} params.keyword - The mandatory keyword or partial match.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array<Object>>} - A list of requirements matching the keyword.
 * @throws {Error} - If the response status is not 200 or if there is an error with the request.
 */
export default async function getRequirementsByMandatoryKeywords({ keyword, token }) {
  try {
    const response = await server.get('/requirements/search/mandatory-keywords', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        keyword,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to retrieve requirements by mandatory keywords");
    }

    const { requirements } = response.data;
    return requirements;
  } catch (error) {
    console.error("Error retrieving requirements by mandatory keywords:", error);
    throw error;
  }
}
