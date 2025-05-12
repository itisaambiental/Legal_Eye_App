import server from "../../config/server.js";

/**
 * Deletes a requirement type by its ID.
 * Sends a DELETE request to the /requirement-type/:id endpoint.
 *
 * @async
 * @function deleteRequirementType
 * @param {Object} params - Parameters for deleting a requirement type.
 * @param {number} params.id - The ID of the requirement type to delete.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<void>} Resolves if deletion was successful.
 * @throws {Error} If the response status is not 204 or if there is an error with the request.
 */
export default async function deleteRequirementType({ id, token }) {
  try {
    const response = await server.delete(`/requirement-types/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 204) {
      throw new Error("Failed to delete requirement type");
    }
  } catch (error) {
    console.error("Error deleting requirement type by ID:", error);
    throw error;
  }
}
