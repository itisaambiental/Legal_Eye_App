import server from "../../config/server.js";

/**
 * Retrieves all requirements from the system.
 * Sends a GET request to fetch the data.
 *
 * @async
 * @function getRequirements
 * @param {Object} params - Parameters for the request.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array<Object>>}  - The list of requirements.
 * @throws {Error} - If the response status is not 200 or if there is an error with the request.
 */
export default async function getRequirements({ token }) {
  try {
    const response = await server.get("/requirements", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to retrieve requirements");
    }

    const { requirements } = response.data;
    return requirements;
  } catch (error) {
    console.error("Error retrieving all requirements:", error);
    throw error;
  }
}
