import server from "../../config/server.js";

/**
 * Retrieves requirements by their requirement number or a partial match.
 * Sends a GET request to fetch matching requirements.
 *
 * @async
 * @function getRequirementsByNumber
 * @param {Object} params - Parameters for the request.
 * @param {string} params.number - The requirement number or partial match.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array<Object>>} - A list of matching requirements.
 * @throws {Error} - If the response status is not 200 or if there is an error with the request.
 */
export default async function getRequirementsByNumber({ number, token }) {
  try {
    const response = await server.get("/requirements/search/number", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { number },
    });

    if (response.status !== 200) {
      throw new Error("Failed to retrieve requirements by number");
    }

    const { requirements } = response.data;
    return requirements;
  } catch (error) {
    console.error("Error retrieving requirements by number:", error);
    throw error;
  }
}
