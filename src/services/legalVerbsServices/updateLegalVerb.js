import server from "../../config/server.js";

/**
 * Updates a legal verb's information by its ID.
 * Sends a PATCH request to the /legal-verbs/:id endpoint with updated data.
 *
 * @async
 * @function updateLegalVerb
 * @param {Object} params - Parameters for updating a legal verb.
 * @param {number} params.id - The ID of the legal verb to update.
 * @param {string} params.name - The new name of the legal verb.
 * @param {string} params.description - The new description of the legal verb.
 * @param {string} params.translation - The new translation of the legal verb.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Object>} The updated legal verb data returned from the server.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function updateLegalVerb({ id, name, description, translation, token }) {
  try {
    const response = await server.patch(
      `/legal-verbs/${id}`,
      { name, description, translation },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to update legal verb");
    }

    const { legalVerb } = response.data;
    return legalVerb;
  } catch (error) {
    console.error("Error updating legal verb:", error);
    throw error;
  }
}
