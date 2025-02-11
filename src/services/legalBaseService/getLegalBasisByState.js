import server from "../../config/server.js";

/**
 * Retrieves legal basis records by state.
 * Sends a GET request to the endpoint to fetch the legal basis data.
 *
 * @async
 * @function getLegalBasisByState
 * @param {Object} params - Parameters for the request.
 * @param {string} params.state - The state of the legal basis to retrieve (required).
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array<Object>>} The list of legal basis records matching the state.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function getLegalBasisByState({ state, token }) {
  try {
    const response = await server.get("/legalBasis/state/state", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        state,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to retrieve legal basis by state");
    }
    const { legalBasis } = response.data;
    return legalBasis;
  } catch (error) {
    console.error("Error retrieving legal basis by state:", error);
    throw error;
  }
}
