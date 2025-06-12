import server from "../../config/server.js";

/**
 * Deletes a requirement identification by its ID.
 *
 * @async
 * @function deleteReqIdentification
 * @param {Object} params - Parameters for deletion.
 * @param {number} params.id - ID of the requirement identification to delete.
 * @param {string} params.token - Authorization token.
 *
 * @returns {Promise<void>} - Resolves if deletion is successful.
 * @throws {Error} - If the request fails or the response status is not 204.
 */
export default async function deleteReqIdentification({ id, token }) {
  try {
    const response = await server.delete(`/req-identification/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 204) {
      throw new Error("Failed to delete requirement identification");
    }
  } catch (error) {
    console.error(`Error deleting requirement identification with ID ${id}:`, error);
    throw error;
  }
}
