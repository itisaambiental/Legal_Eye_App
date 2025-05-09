import server from "../../config/server.js";

/**
 * Retrieves all legal verbs.
 * Sends a GET request to fetch all legal verbs from the backend.
 *
 * @async
 * @function getLegalVerbs
 * @param {Object} params - Parameters for retrieving the legal verbs.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array<Object>>} The array of legal verbs returned from the server.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function getLegalVerbs({ token }) {
  try {
    const response = await server.get("/legal-verbs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to retrieve legal verbs");
    }

    const { legalVerbs } = response.data;
    return legalVerbs;
  } catch (error) {
    console.error("Error retrieving legal verbs:", error);
    throw error;
  }
}
