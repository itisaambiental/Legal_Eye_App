import server from "../../config/server.js";

/**
 * Retrieves legal verbs by name or partial name.
 * Sends a GET request to search legal verbs by name.
 *
 * @async
 * @function getLegalVerbsByName
 * @param {Object} params - Parameters for the search.
 * @param {string} params.name - The name or partial name of the legal verb.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array<Object>>} Array of legal verbs matching the name.
 * @throws {Error} If the response is not 200 or if the request fails.
 */
export default async function getLegalVerbsByName({ name, token }) {
  try {
    const response = await server.get("/legal-verbs/search/name", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        name,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to retrieve legal verbs by name");
    }

    const { legalVerbs } = response.data;
    return legalVerbs;
  } catch (error) {
    console.error("Error retrieving legal verbs by name:", error);
    throw error;
  }
}
