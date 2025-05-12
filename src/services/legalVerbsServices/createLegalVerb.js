import server from "../../config/server.js";

/**
 * Creates a new legal verb in the system.
 * Sends a POST request with legal verb data to the backend.
 *
 * @async
 * @function createLegalVerb
 * @param {Object} params - Parameters for creating a new legal verb.
 * @param {string} params.name - The name of the legal verb.
 * @param {string} params.description - The description of the legal verb.
 * @param {string} params.translation - The translation of thelegal verb.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Object>} The created legal verb data returned from the server.
 * @throws {Error} If the response status is not 201 or if there is an error with the request.
 */
export default async function createLegalVerb({
  name,
  description,
  translation,
  token,
}) {
  try {
    const response = await server.post(
      "/legal-verbs",
      { name, description, translation },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status !== 201) {
      throw new Error("Failed to create legal verb");
    }

    const { legalVerb } = response.data;
    return legalVerb;
  } catch (error) {
    console.error("Error creating legal verb: ", error);
    throw error;
  }
}
