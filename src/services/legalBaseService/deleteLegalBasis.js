import server from "../../config/server.js";

/**
 * Deletes a legal basis by its ID.
 * Sends a DELETE request to the /api/legalBasis/:id endpoint.
 *
 * @async
 * @function deleteLegalBasis
 * @param {Object} params - Parameters for deleting a legal basis.
 * @param {string} params.id - The ID of the legal basis to delete.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<void>} Resolves if deletion was successful.
 * @throws {Error} If the response status is not 204 or if there is an error with the request.
 */
export default async function deleteLegalBasis({ id, token }) {
  try {
    const response = await server.delete(`legalBasis/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status !== 204) {
      throw new Error("Failed to delete legal basis");
    }
  } catch (error) {
    console.error("Error deleting legal basis", error);
    throw error;
  }
}
