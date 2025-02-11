import server from "../../config/server.js";

/**
 * Deletes an article by its ID.
 * Sends a DELETE request to the backend to remove the specified article.
 *
 * @async
 * @function deleteArticle
 * @param {Object} params - Parameters for deleting an article.
 * @param {string} params.id - The ID of the article to delete.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<void>} Resolves if the deletion is successful.
 * @throws {Error} If the response status is not 204 or if there is an error with the request.
 */
export default async function deleteArticle({ id, token }) {
  try {
    const response = await server.delete(`/article/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status !== 204) {
      throw new Error("Failed to delete article");
    }
  } catch (error) {
    console.error("Error deleting article:", error);
    throw error;
  }
}
