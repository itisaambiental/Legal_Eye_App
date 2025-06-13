import server from "../../config/server.js";

/**
 * Retrieves requirement identifications filtered by state name.
 *
 * @async
 * @function getReqIdentificationsByState
 * @param {Object} params - Parameters for the request.
 * @param {string} params.state - Name of the state to filter by.
 * @param {string} params.token - Authorization token.
 *
 * @returns {Promise<Object[]>} - An array of requirement identifications for the specified state.
 * @throws {Error} - If the request fails or the response status is not 200.
 */
export default async function getReqIdentificationsByState({ state, token }) {
  try {
    const response = await server.get("/req-identification/search/state", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        state,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to fetch requirement identifications by state");
    }

    const { reqIdentifications } = response.data;
    return reqIdentifications;
  } catch (error) {
    console.error(
      "Error fetching requirement identifications by state:",
      error
    );
    throw error;
  }
}
