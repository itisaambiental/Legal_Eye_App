import server from "../../config/server.js";

/**
 * Retrieves  legal verbs by translation or partial  translation.
 * Sends a GET request to search  legal verbs by translation.
 *
 * @async
 * @function getLegalVerbsByTranslation
 * @param {Object} params - Parameters for the search.
 * @param {string} params.translation - The partial  translation to search for.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array<Object>>} Array of  legal verbs by matching the  translation.
 * @throws {Error} If the response is not 200 or if the request fails.
 */
export default async function getLegalVerbsByTranslation({  translation, token }) {
  try {
    const response = await server.get("/legal-verbs/search/translation", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        translation,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to retrieve  legal verbs by translation");
    }

    const { legalVerbs } = response.data;
    return legalVerbs;
  } catch (error) {
    console.error("Error retrieving legal verbs by translation:", error);
    throw error;
  }
}
