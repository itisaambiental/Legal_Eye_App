import server from "../../config/server.js";

/**
 * Retrieves legal basis records filtered by subject, jurisdiction, state, municipalities, and aspect IDs.
 * Sends a GET request to the corresponding backend endpoint.
 *
 * @async
 * @function getLegalBasisBySubjectAndFilters
 * @param {Object} params - Parameters for the request.
 * @param {number} params.subjectId - The ID of the subject (required).
 * @param {Array<number>} [params.aspectIds] - An optional array of aspect IDs to filter.
 * @param {string} [params.jurisdiction] - The jurisdiction filter: 'Federal', 'Estatal', or 'Local'.
 * @param {string} [params.state] - The state name (required for Estatal and Local).
 * @param {Array<string>} [params.municipalities] - The list of municipalities (required for Local).
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array<Object>>} The list of legal basis records matching the filters.
 * @throws {Error} If the request fails or the response is not 200 OK.
 */
export default async function getLegalBasisBySubjectAndFilters({
  subjectId,
  aspectIds = [],
  jurisdiction = "",
  state = "",
  municipalities = [],
  token,
}) {
  try {
    const response = await server.get(
      `/legalBasis/subject/aspects/state/municipalities/query`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          subjectId,
          aspectIds,
          jurisdiction,
          state,
          municipalities,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to retrieve legal basis with filters");
    }

    const { legalBasis } = response.data;
    return legalBasis;
  } catch (error) {
    console.error(
      "Error retrieving legal basis by subject and filters:",
      error
    );
    throw error;
  }
}
