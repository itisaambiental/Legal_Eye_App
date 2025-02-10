import server from "../../config/server.js";

/**
 * Updates an article by its ID.
 * Sends a PATCH request with the updated article data to the backend.
 *
 * @async
 * @function updateArticle
 * @param {Object} params - Parameters for updating an article.
 * @param {string} params.id - The ID of the article to update.
 * @param {string} [params.title] - The new title of the article (optional).
 * @param {string} [params.article] - The new content of the article (optional).
 * @param {number} [params.order] - The new order of the article (optional).
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Object>} The updated article data returned from the server.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function updateArticle({ id, title, article, order, token }) {
  try {
    const response = await server.patch(
      `/article/${id}`,
      { title, article, order },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status !== 200) {
      throw new Error("Failed to update article");
    }
    return response.data.updatedArticle;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
