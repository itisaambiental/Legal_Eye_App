import server from "../../config/server.js";

/**
 * Retrieves requirements by their mandatory sentences.
 * Sends a GET request to fetch matching requirements.
 *
 * @async
 * @function getRequirementsByMandatorySentences
 * @param {Object} params - Parameters for the request.
 * @param {string} params.sentence - The mandatory sentence or partial match.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array<Object>>} - A list of requirements matching the sentence.
 * @throws {Error} - If the response status is not 200 or if there is an error with the request.
 */
export default async function getRequirementsByMandatorySentences({ sentence, token }) {
  try {
    const response = await server.get('/requirements/search/mandatory-sentences', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        sentence,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to retrieve requirements by mandatory sentences");
    }

    const { requirements } = response.data;
    return requirements;
  } catch (error) {
    console.error("Error retrieving requirements by mandatory sentences:", error);
    throw error;
  }
}
