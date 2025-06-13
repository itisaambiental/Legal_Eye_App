import server from "../../config/server.js";

/**
 * Retrieves a requirement identification by its ID.
 *
 * @async
 * @function getReqIdentificationById
 * @param {Object} params - Parameters for the request.
 * @param {number} params.id - The ID of the requirement identification to retrieve.
 * @param {string} params.token - Authorization token.
 *
 * @returns {Promise<Object>} - The requirement identification object.
 * @throws {Error} - If the request fails or the response status is not 200.
 */
export default async function getReqIdentificationById({ id, token }) {
  try {
    const response = await server.get(`/req-identification/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to fetch requirement identification");
    }

    const { reqIdentification } = response.data;
    return reqIdentification;
  } catch (error) {
    console.error("Error fetching requirement identification");
    throw error;
  }
}
