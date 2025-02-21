import server from "../../config/server.js";

/**
 * Retrieves requirements by their complementary sentences.
 * Sends a GET request to fetch matching requirements.
 *
 * @async
 * @function getRequirementsByComplementarySentences
 * @param {Object} params - Parameters for the request.
 * @param {string} params.sentence - The complementary sentence or partial match.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array<Object>>} - A list of requirements matching the sentence.
 * @throws {Error} - If the response status is not 200 or if there is an error with the request.
 */
export default async function getRequirementsByComplementarySentences({ sentence, token }) {
  try {
    const response = await server.get('/requirements/search/complementary-sentences', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        sentence,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to retrieve requirements by complementary sentences");
    }

    const { requirements } = response.data;
    return requirements;
  } catch (error) {
    console.error("Error retrieving requirements by complementary sentences:", error);
    throw error;
  }
}
