import server from "../../config/server.js";

/**
 * Retrieves requirement identifications by full-text search in their descriptions.
 *
 * @async
 * @function getReqIdentificationsByDescription
 * @param {Object} params - Parameters for the request.
 * @param {string} params.description - Text to search for in the descriptions.
 * @param {string} params.token - Authorization token.
 *
 * @returns {Promise<Object[]>} - An array of matching requirement identifications.
 * @throws {Error} - If the request fails or the response status is not 200.
 */
export default async function getReqIdentificationsByDescription({ 
    description, token,
 }) {
  try {
    const response = await server.get(
        "/req-identification/search/description", 
        {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        description,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to fetch requirement identifications by description");
    }

    return response.data.reqIdentifications;
  } catch (error) {
    console.error("Error fetching requirement identifications by description:", error);
    throw error;
  }
}
