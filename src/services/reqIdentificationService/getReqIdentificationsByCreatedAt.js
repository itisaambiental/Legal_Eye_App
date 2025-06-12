import server from "../../config/server.js";

/**
 * Retrieves requirement identifications filtered by creation date range.
 *
 * @async
 * @function getReqIdentificationsByCreatedAt
 * @param {Object} params - Parameters for the request.
 * @param {string} [params.from] - Start date in YYYY-MM-DD format (optional).
 * @param {string} [params.to] - End date in YYYY-MM-DD format (optional).
 * @param {string} params.token - Authorization token.
 *
 * @returns {Promise<Object[]>} - An array of requirement identifications.
 * @throws {Error} - If the request fails or the response status is not 200.
 */
export default async function getReqIdentificationsByCreatedAt({ from, to, token }) {
  try {
    const response = await server.get("/req-identification/search/created-at", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        ...(from && { from }),
        ...(to && { to }),
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to fetch requirement identifications by creation date");
    }

    return response.data.reqIdentifications;
  } catch (error) {
    console.error("Error fetching requirement identifications by date:", error);
    throw error;
  }
}
