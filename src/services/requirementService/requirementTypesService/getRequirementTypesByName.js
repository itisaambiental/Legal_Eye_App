// src/services/requirementService/requirementTypesService/getRequirementTypesByName.js
import server from "../../config/server.js";

/**
 * Retrieves requirement types by name or partial name.
 * Sends a GET request to search requirement types by name.
 *
 * @async
 * @function getRequirementTypesByName
 * @param {Object} params - Parameters for the search.
 * @param {string} params.name - The name or partial name of the requirement type.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array<Object>>} Array of requirement types matching the name.
 * @throws {Error} If the response is not 200 or if the request fails.
 */
export default async function getRequirementTypesByName({ name, token }) {
  try {
    const response = await server.get(
      `/requirement-types/name?name=${encodeURIComponent(name)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to retrieve requirement types by name");
    }

    const { requirementTypes } = response.data;
    return requirementTypes;
  } catch (error) {
    console.error("Error retrieving requirement types by name:", error);
    throw error;
  }
}
