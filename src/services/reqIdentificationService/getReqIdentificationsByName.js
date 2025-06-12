import server from "../../config/server.js";

/**
 * Retrieves requirement identifications by matching name (partial match).
 *
 * @async
 * @function getReqIdentificationsByName
 * @param {Object} params - Parameters for the request.
 * @param {string} params.name - Partial or full name to search.
 * @param {string} params.token - Authorization token.
 *
 * @returns {Promise<Object[]>} - An array of matching requirement identifications.
 * @throws {Error} - If the request fails or the response status is not 200.
 */
export default async function getReqIdentificationsByName({ name, token }) {
  try {
    const response = await server.get("/req-identification/search/name", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        name,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to fetch requirement identifications by name");
    }

    return response.data.reqIdentifications;
  } catch (error) {
    console.error("Error fetching requirement identifications by name:", error);
    throw error;
  }
}
