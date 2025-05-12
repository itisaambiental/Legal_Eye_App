import server from "../../config/server.js";

/**
 * Deletes multiple requirement types by their requirementTypeIds.
 * Sends a DELETE request to the /requirement-types/batch endpoint.
 *
 * @async
 * @function deleteRequirementTypesBatch
 * @param {Object} params - Parameters for deleting requirement types.
 * @param {Array<number>} params.requirementTypesIds - Array of requirement type IDs to delete.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<void>} Resolves if deletion was successful.
 * @throws {Error} If the response status is not 204 or if there is an error with the request.
 */
export default async function deleteRequirementTypesBatch({
  requirementTypesIds,
  token,
}) {
  try {
    const response = await server.delete(`/requirement-types/delete/batch`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { requirementTypesIds },
    });

    if (response.status !== 204) {
      throw new Error("Failed to delete requirement types");
    }
    return true;
  } catch (error) {
    console.error("Error deleting requirement types batch:", error);
    throw error;
  }
}
