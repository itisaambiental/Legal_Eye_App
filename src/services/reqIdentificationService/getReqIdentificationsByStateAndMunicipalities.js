import server from "../../config/server.js";

/**
 * Retrieves requirement identifications filtered by state and municipalities.
 *
 * @async
 * @function getReqIdentificationsByStateAndMunicipalities
 * @param {Object} params - Parameters for the request.
 * @param {string} params.state - Name of the state.
 * @param {string[]|string} params.municipalities - One or more municipality names.
 * @param {string} params.token - Authorization token.
 *
 * @returns {Promise<Object[]>} - An array of requirement identifications.
 * @throws {Error} - If the request fails or the response status is not 200.
 */
export default async function getReqIdentificationsByStateAndMunicipalities({
  state,
  municipalities,
  token,
}) {
  try {
    const response = await server.get(
      "/req-identification/search/state-municipalities",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          state,
          municipalities,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(
        "Failed to fetch requirement identifications by state and municipalities"
      );
    }

    const { reqIdentifications } = response.data;
    return reqIdentifications;
  } catch (error) {
    console.error(
      "Error fetching requirement identifications by state and municipalities:",
      error
    );
    throw error;
  }
}
