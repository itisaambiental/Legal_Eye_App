import server from "../../config/server.js";

/**
 * Deletes multiple legal verbs by their legalVerbsIds.
 * Sends a DELETE request to the legalVerbsIds endpoint.
 *
 * @async
 * @function deleteLegalVerbsBatch
 * @param {Object} params - Parameters for deleting legal verbs.
 * @param {Array<number>} params.legalVerbsIds - Array of legal verb IDs to delete.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<void>} Resolves if deletion was successful.
 * @throws {Error} If the response status is not 204 or if there is an error with the request.
 */
export default async function deleteLegalVerbsBatch({
    legalVerbsIds,
  token,
}) {
  try {
    const response = await server.delete(`/legal-verbs/delete/batch`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { legalVerbsIds },
    });

    if (response.status !== 204) {
      throw new Error("Failed to delete legal verbs");
    }
    return true;
  } catch (error) {
    console.error("Error deleting legal verbs batch:", error);
    throw error;
  }
}
