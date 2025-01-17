import server from "../../config/server.js";

/**
 * Retrieves all classification values.
 * Sends a GET request to the endpoint to fetch the data.
 *
 * @async
 * @function getClassifications
 * @param {Object} params - Parameters for the request.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array<string>>} The list of unique classification strings.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function getClassifications({ token }) {
  try {
    const response = await server.get(
      "/legalBasis/classification/classification/all",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status !== 200) {
      throw new Error("Failed to retrieve classifications");
    }
    return response.data.classifications;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
