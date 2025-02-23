import server from "../../config/server.js";

/**
 * Deletes multiple requirements by their IDs.
 * Sends a DELETE request to the backend with an array of requirement IDs.
 *
 * @async
 * @function deleteRequirementsBatch
 * @param {Object} params - Parameters for deleting multiple requirements.
 * @param {Array<string>} params.requirementIds - The IDs of the requirements to delete.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<void>} - Resolves if the requirements are deleted successfully.
 * @throws {Error} - If the response status is not 204 or if there is an error with the request.
 */
export default async function deleteRequirementsBatch({ requirementIds, token }) {
  try {
    const response = await server.delete("/requirements/batch", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: { requirementIds },
    });

    if (response.status !== 204) {
      throw new Error("Failed to delete multiple requirements");
    }
  } catch (error) {
    console.error("Error deleting multiple requirements:", error);
    throw error;
  }
}
