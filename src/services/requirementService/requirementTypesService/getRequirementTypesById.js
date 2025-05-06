// src/services/requirementService/requirementTypesService/getRequirementTypeById.js
import server from "../../../config/server.js";

/**
 * Retrieves a specific requirement type by its ID.
 * Sends a GET request to fetch a specific requirement type from the backend.
 *
 * @async
 * @function getRequirementTypeById
 * @param {Object} params - Parameters for retrieving the requirement type.
 * @param {number} params.id - The ID of the requirement type to retrieve.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Object>} The requirement type data returned from the server.
 * @throws {Error} If the response status is not 200 or if the request fails.
 */
export default async function getRequirementTypeById({ id, token }) {
  try {
    const response = await server.get(`/requirement-type/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to retrieve requirement type");
    }

    const { requirementType } = response.data;
    return requirementType;
  } catch (error) {
    console.error("Error retrieving requirement type by ID:", error);
    throw error;
  }
}
