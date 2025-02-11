import server from "../../config/server.js";

/**
 * Fetches legal basis records filtered by jurisdiction and date range.
 * Sends a GET request to the backend service endpoint to retrieve the legal basis data.
 *
 * @async
 * @function getLegalBasisByLastReform
 * @param {Object} params - Parameters for the request.
 * @param {string} params.from - Start date.
 * @param {string} params.to - End date.
 * @param {string} params.token - Authorization token for the request.
 *
 * @returns {Promise<Array<Object>>} Resolves to an array of legal basis records matching the criteria.
 * @throws {Error} Throws an error if the response status is not 200 or if there is an issue with the request.
 */
export default async function getLegalBasisByLastReform({ from, to, token }) {
  try {
    const response = await server.get("/legalBasis/lastReform/lastReform", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { from, to },
    });

    if (response.status !== 200) {
      throw new Error("Failed to retrieve legal basis by lastReform");
    }
    const { legalBasis } = response.data;
    return legalBasis;
  } catch (error) {
    console.error("Error retrieving legal basis by last reform date:", error);
    throw error;
  }
}
