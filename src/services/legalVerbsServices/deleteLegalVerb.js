import server from "../../config/server.js";

/**
 * Deletes a legal verb by its ID.
 * Sends a DELETE request to the /legal-verbs/:id endpoint.
 *
 * @async
 * @function deleteLegalVerb
 * @param {Object} params - Parameters for deleting a legal verb.
 * @param {number} params.id - The ID of the legal verb to delete.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<void>} Resolves if deletion was successful.
 * @throws {Error} If the response status is not 204 or if there is an error with the request.
 */
export default async function deleteLegalVerb({ id, token }) {
  try {
    const response = await server.delete(`/legal-verbs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 204) {
      throw new Error("Failed to delete legal verb");
    }
  } catch (error) {
    console.error("Error deleting legal verb by ID:", error);
    throw error;
  }
}
