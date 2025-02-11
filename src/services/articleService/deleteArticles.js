import server from "../../config/server.js";

/**
 * Deletes multiple articles by their IDs.
 * Sends a batch DELETE request to the server with an array of article IDs and an authorization token.
 *
 * @async
 * @function deleteArticles
 * @param {Object} params - Parameters for deleting articles.
 * @param {Array<number>} params.articleIds - An array of article IDs to delete.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<boolean>} Returns `true` if the articles were deleted successfully.
 * @throws {Error} If the response status is not 204 or if there is an error with the request.
 */
export default async function deleteArticles({ articleIds, token }) {
  try {
    const response = await server.delete('/articles/batch', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { articleIds },
    });

    if (response.status !== 204) {
      throw new Error("Failed to delete articles");
    }

    return true;
  } catch (error) {
    console.error("Error deleting multiple articles:", error);
    throw error;
  }
}
