import server from "../../config/server.js";

/**
 * Deletes multiple legal bases by their IDs.
 * Sends a DELETE request to the /api/legalBases/batch endpoint.
 *
 * @async
 * @function deleteLegalBasisBatch
 * @param {Object} params - Parameters for deleting legal bases.
 * @param {Array<string>} params.legalBasisIds - The IDs of the legal bases to delete.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<void>} Resolves if deletion was successful.
 * @throws {Error} If the response status is not 204 or if there is an error with the request.
 */
export default async function deleteLegalBasisBatch({ legalBasisIds, token }) {
  try {
    const response = await server.delete(`/legalBasis/delete/batch`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { legalBasisIds },
    });
    if (response.status !== 204) {
      throw new Error("Failed to delete legal bases in batch");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
