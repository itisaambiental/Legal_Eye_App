import server from "../../config/server.js";

/**
 * Retrieves all requirement identifications from the backend.
 *
 * @async
 * @function getAllReqIdentifications
 * @param {Object} params - Parameters for the request.
 * @param {string} params.token - Authorization token.
 *
 * @returns {Promise<Object[]>} - An array of requirement identifications.
 * @throws {Error} - If the request fails or the response status is not 200.
 */
export default async function getAllReqIdentifications({ token }) {
  try {
    const response = await server.get("/req-identification", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to fetch requirement identifications");
    }

    return response.data.reqIdentifications;
  } catch (error) {
    console.error("Error fetching all requirement identifications:", error);
    throw error;
  }
}
