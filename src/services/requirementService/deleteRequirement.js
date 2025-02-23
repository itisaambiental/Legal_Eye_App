import server from "../../config/server.js";

/**
 * Deletes a requirement by its ID.
 * Sends a DELETE request to the backend.
 *
 * @async
 * @function deleteRequirement
 * @param {Object} params - Parameters for deleting a requirement.
 * @param {string} params.id - The ID of the requirement to delete.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<void>} - Resolves if the requirement is deleted successfully.
 * @throws {Error} - If the response status is not 204 or if there is an error with the request.
 */
export default async function deleteRequirement({ id, token }) {
  try {
    const response = await server.delete(`/requirement/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 204) {
      throw new Error("Failed to delete requirement");
    }
  } catch (error) {
    console.error("Error deleting requirement:", error);
    throw error;
  }
}
