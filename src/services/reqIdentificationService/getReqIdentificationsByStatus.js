import server from "../../config/server.js";

/**
 * Retrieves requirement identifications filtered by status.
 *
 * @async
 * @function getReqIdentificationsByStatus
 * @param {Object} params - Parameters for the request.
 * @param {string} params.status - Status to filter by ('Activo' | 'Fallido' | 'Completado').
 * @param {string} params.token - Authorization token.
 *
 * @returns {Promise<Object[]>} - An array of requirement identifications with the specified status.
 * @throws {Error} - If the request fails or the response status is not 200.
 */
export default async function getReqIdentificationsByStatus({ status, token }) {
  try {
    const response = await server.get("/req-identification/search/status", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        status,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to fetch requirement identifications by status");
    }

    const { reqIdentifications } = response.data;
    return reqIdentifications;
  } catch (error) {
    console.error(
      "Error fetching requirement identifications by status:",
      error
    );
    throw error;
  }
}
