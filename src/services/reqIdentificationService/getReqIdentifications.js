import server from "../../config/server.js";

/**
 * Retrieves all requirement identifications.
 * Sends a GET request to the endpoint to fetch the data.
 *
 * @async
 * @function getReqIdentifications
 * @param {Object} params - Parameters for the request.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array<Object>>} The list of requirement identifications.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function getReqIdentifications({ token }) {
  try {
    const response = await server.get("/req-identification", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to retrieve requirement identifications");
    }

    const { reqIdentifications } = response.data;
    return reqIdentifications;
  } catch (error) {
    console.error("Error retrieving all requirement identifications:", error);
    throw error;
  }
}
