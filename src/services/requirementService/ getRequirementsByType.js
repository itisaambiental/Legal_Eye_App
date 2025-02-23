import server from "../../config/server.js";

/**
 * Retrieves requirements by their type.
 * Sends a GET request to fetch matching requirements.
 *
 * @async
 * @function getRequirementsByType
 * @param {Object} params - Parameters for the request.
 * @param {string} params.requirementType - The type of requirement to filter by.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array<Object>>} - A list of requirements matching the type.
 * @throws {Error} - If the response status is not 200 or if there is an error with the request.
 */
export default async function getRequirementsByType({ requirementType, token }) {
  try {
    const response = await server.get('/requirements/search/type', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        requirementType,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to retrieve requirements by type");
    }

    const { requirements } = response.data;
    return requirements;
  } catch (error) {
    console.error("Error retrieving requirements by type:", error);
    throw error;
  }
}
