import server from "../../config/server.js";

/**
 * Deletes multiple requirement identifications by their IDs.
 *
 * @async
 * @function deleteReqIdentificationsBatch
 * @param {Object} params - Parameters for batch deletion.
 * @param {number[]} params.reqIdentificationIds - Array of IDs to delete.
 * @param {string} params.token - Authorization token.
 *
 * @returns {Promise<void>} - Resolves if deletion is successful.
 * @throws {Error} - If the request fails or the response status is not 204.
 */
export default async function deleteReqIdentificationsBatch({ reqIdentificationIds, token }) {
  try {
    const response = await server.delete(`/req-identification/delete/batch`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      data: {
        reqIdentificationIds,
      },
    });

    if (response.status !== 204) {
      throw new Error("Failed to delete requirement identifications in batch");
    }
  } catch (error) {
    console.error("Error deleting requirement identifications batch:", error);
    throw error;
  }
}
