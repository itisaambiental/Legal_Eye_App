import server from "../../config/server.js";

/**
 * Retrieves a list of articles matching the specified description for a specific legal basis from the backend.
 * Sends a GET request to the endpoint to fetch the article data.
 *
 * @async
 * @function getArticlesByDescription
 * @param {Object} params - Parameters for the request.
 * @param {number} params.legalBasisId - The ID of the legal basis to filter articles by.
 * @param {string} params.description - The description or part of the description of the articles to retrieve.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array>} The list of articles matching the description returned from the server.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function getArticlesByDescription({
  legalBasisId,
  description,
  token,
}) {
  try {
    const response = await server.get(`/articles/${legalBasisId}/description`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        description,
      },
    });
    if (response.status !== 200) {
      throw new Error("Failed to retrieve articles");
    }
    return response.data.articles;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
