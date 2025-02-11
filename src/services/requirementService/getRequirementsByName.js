import server from "../../config/server.js";

/**
 * Retrieves requirements by their name or a partial match.
 * Sends a GET request to fetch matching requirements.
 *
 * @async
 * @function getRequirementsByName
 * @param {Object} params - Parameters for the request.
 * @param {string} params.name - The requirement name or partial match.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array<Object>>} - A list of matching requirements.
 * @throws {Error} - If the response status is not 200 or if there is an error with the request.
 */
export default async function getRequirementsByName({ name, token }) {
  try {
    const response = await server.get("/requirements/search/name", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { name },
    });

    if (response.status !== 200) {
      throw new Error("Failed to retrieve requirements by name");
    }

    const { requirements } = response.data;
    return requirements;
  } catch (error) {
    console.error("Error retrieving requirements by name:", error);
    throw error;
  }
}
