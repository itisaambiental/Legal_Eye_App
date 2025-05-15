import server from "../../config/server.js";

/**
 * Retrieves a specific requirement by its ID.
 * Sends a GET request to fetch the requirement data.
 *
 * @async
 * @function getRequirementById
 * @param {Object} params - Parameters for the request.
 * @param {number} params.id - The ID of the requirement to retrieve.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Object>} - The retrieved requirement data.
 * @throws {Error} - If the response status is not 200 or if there is an error with the request.
 */
export default async function getRequirementById({ id, token }) {
  try {
    const response = await server.get(`/requirement/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to retrieve requirement");
    }

    const { requirement } = response.data;
    return requirement;
  } catch (error) {
    console.error("Error retrieving requirement by ID:", error);
    throw error;
  }
}
