import server from "../../config/server.js";

/**
 * Retrieves requirements by their mandatory description.
 * Sends a GET request to fetch matching requirements.
 *
 * @async
 * @function getRequirementsByMandatoryDescription
 * @param {Object} params - Parameters for the request.
 * @param {string} params.description - The mandatory description or partial match.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array<Object>>} - A list of requirements matching the description.
 * @throws {Error} - If the response status is not 200 or if there is an error with the request.
 */
export default async function getRequirementsByMandatoryDescription({ description, token }) {
  try {
    const response = await server.get('/requirements/search/mandatory-description', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        description,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to retrieve requirements by mandatory description");
    }

    const { requirements } = response.data;
    return requirements;
  } catch (error) {
    console.error("Error retrieving requirements by mandatory description:", error);
    throw error;
  }
}
