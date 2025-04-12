import server from "../../config/server.js";

/**
 * Retrieves legal basis records by dynamic filters.
 * Sends a GET request to the corresponding backend endpoint.
 *
 * @async
 * @function getLegalBasisByCriteria
 * @param {Object} params - Parameters for the request.
 * @param {string} [params.jurisdiction] - The jurisdiction filter: 'Federal', 'Estatal', or 'Local'.
 * @param {string} [params.state] - The state name (optional).
 * @param {Array<string>} [params.municipalities] - The list of municipalities (optional).
 * @param {number} [params.subjectId] - The ID of the subject (optional).
 * @param {Array<number>} [params.aspectIds] - An optional array of aspect IDs to filter.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array<Object>>} The list of legal basis records matching the filters.
 * @throws {Error} If the request fails or the response is not 200 OK.
 */
export default async function getLegalBasisByCriteria({
  jurisdiction = "",
  state = "",
  municipalities = [],
  subjectId,
  aspectIds = [],
  token,
}) {
  try {
    const response = await server.get("/legalBasis/criteria/query", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        jurisdiction,
        state,
        municipalities,
        subjectId,
        aspectIds,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to retrieve legal basis with filters");
    }

    const { legalBasis } = response.data;
    return legalBasis;
  } catch (error) {
    console.error("Error retrieving legal basis by criteria:", error);
    throw error;
  }
}
