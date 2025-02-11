import server from "../../config/server.js";

/**
 * Retrieves all jurisdiction values.
 * Sends a GET request to the endpoint to fetch the data.
 *
 * @async
 * @function getJurisdictions
 * @param {Object} params - Parameters for the request.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array<string>>} The list of unique jurisdictions as objects.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function getJurisdictions({ token }) {
  try {
    const response = await server.get(
      '/legalBasis/jurisdiction/jurisdiction/all',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to retrieve jurisdictions");
    }
    const { jurisdictions } = response.data;
    return jurisdictions;
  } catch (error) {
    console.error("Error retrieving jurisdictions:", error);
    throw error;
  }
}
