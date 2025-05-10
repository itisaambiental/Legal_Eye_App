import server from "../../config/server.js";

/**
 * Retrieves requirement types by description or partial description.
 * Sends a GET request to search requirement types by description.
 *
 * @async
 * @function getRequirementTypesByDescription
 * @param {Object} params - Parameters for the search.
 * @param {string} params.description - The partial description of the requirement type.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array<Object>>} Array of requirement types matching the description.
 * @throws {Error} If the response is not 200 or if the request fails.
 */
export default async function getRequirementTypesByDescription({ description, token }) {
  try {
    const response = await server.get("/requirement-types/search/description", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        description,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to retrieve requirement types by description");
    }

    const { requirementTypes } = response.data;
    return requirementTypes;
  } catch (error) {
    console.error("Error retrieving requirement types by description:", error);
    throw error;
  }
}
