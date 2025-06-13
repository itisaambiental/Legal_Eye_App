import server from "../../config/server.js";

/**
 * Retrieves requirement identifications filtered by user ID.
 *
 * @async
 * @function getReqIdentificationsByUserId
 * @param {Object} params - Parameters for the request.
 * @param {number} params.userId - ID of the user to filter by.
 * @param {string} params.token - Authorization token.
 *
 * @returns {Promise<Object[]>} - An array of requirement identifications created by the user.
 * @throws {Error} - If the request fails or the response status is not 200.
 */
export default async function getReqIdentificationsByUserId({ userId, token }) {
  try {
    const response = await server.get(
      `/req-identification/search/user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to fetch requirement identifications by user ID");
    }

    const { reqIdentifications } = response.data;
    return reqIdentifications;
  } catch (error) {
    console.error(
      "Error fetching requirement identifications by user ID:",
      error
    );
    throw error;
  }
}
