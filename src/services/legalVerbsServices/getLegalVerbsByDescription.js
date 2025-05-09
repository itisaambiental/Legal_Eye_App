import server from "../../config/server.js";

/**
 * Retrieves legal verbs by description or partial description.
 * Sends a GET request to search legal verbs by description.
 *
 * @async
 * @function getLegalVerbsByDescription
 * @param {Object} params - Parameters for the search.
 * @param {string} params.description - The partial description of the legal verbs.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array<Object>>} Array of legal verbs matching the description.
 * @throws {Error} If the response is not 200 or if the request fails.
 */
export default async function getLegalVerbsByDescription({ description, token }) {
  try {
    const response = await server.get("/legal-verbs/search/description", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        description,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to retrieve legal verbs by description");
    }

    const { legalVerbs } = response.data;
    return legalVerbs;
  } catch (error) {
    console.error("Error retrieving legal verbs by description:", error);
    throw error;
  }
}