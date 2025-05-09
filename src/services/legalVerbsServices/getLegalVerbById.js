import server from "../../config/server.js";

/**
 * Retrieves a specific legal verb by its ID.
 * Sends a GET request to fetch a specific legal verb from the backend.
 *
 * @async
 * @function getLegalVerbById
 * @param {Object} params - Parameters for retrieving the legal verb.
 * @param {number} params.id - The ID of the legal verb to retrieve.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Object>} The legal verb data returned from the server.
 * @throws {Error} If the response status is not 200 or if the request fails.
 */
export default async function getLegalVerbById({ id, token }) {
  try {
    const response = await server.get(`/legal-verbs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to retrieve legal verb");
    }

    const { legalVerb } = response.data;
    return legalVerb;
  } catch (error) {
    console.error("Error retrieving legal verb by ID:", error);
    throw error;
  }
}
