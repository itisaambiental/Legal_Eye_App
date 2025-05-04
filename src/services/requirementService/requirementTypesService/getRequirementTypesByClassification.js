// src/services/requirementService/requirementTypesService/getRequirementTypesByClassification.js
import server from "../../config/server.js";

/**
 * Retrieves requirement types by classification or partial classification.
 * Sends a GET request to search requirement types by classification.
 *
 * @async
 * @function getRequirementTypesByClassification
 * @param {Object} params - Parameters for the search.
 * @param {string} params.classification - The partial classification to search for.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array<Object>>} Array of requirement types matching the classification.
 * @throws {Error} If the response is not 200 or if the request fails.
 */
export default async function getRequirementTypesByClassification({ classification, token }) {
  try {
    const response = await server.get(
      `/requirement-types/classification?classification=${encodeURIComponent(classification)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to retrieve requirement types by classification");
    }

    const { requirementTypes } = response.data;
    return requirementTypes;
  } catch (error) {
    console.error("Error retrieving requirement types by classification:", error);
    throw error;
  }
}
