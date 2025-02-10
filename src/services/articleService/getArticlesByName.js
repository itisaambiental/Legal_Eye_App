import server from "../../config/server.js";

/**
 * Retrieves a list of articles matching the specified name for a specific legal basis from the backend.
 * Sends a GET request to the endpoint to fetch the article data.
 *
 * @async
 * @function getArticlesByName
 * @param {Object} params - Parameters for the request.
 * @param {number} params.legalBasisId - The ID of the legal basis to filter articles by.
 * @param {string} params.name - The name or part of the name of the articles to retrieve.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array>} The list of articles matching the name returned from the server.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function getArticlesByName({ legalBasisId, name, token }) {
  try {
    const response = await server.get(`/articles/${legalBasisId}/name`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        name,
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
