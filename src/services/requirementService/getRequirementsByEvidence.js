import server from "../../config/server.js";

/**
 * Retrieves requirements by their evidence type.
 * Sends a GET request to fetch matching requirements.
 *
 * @async
 * @function getRequirementsByEvidence
 * @param {Object} params - Parameters for the request.
 * @param {string} params.evidence - The evidence type (e.g., "Trámite", "Registro", "Específico", "Documento").
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array<Object>>} - A list of requirements matching the evidence type.
 * @throws {Error} - If the response status is not 200 or if there is an error with the request.
 */
export default async function getRequirementsByEvidence({ evidence, token }) {
  try {
    const response = await server.get('/requirements/search/evidence', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        evidence,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to retrieve requirements by evidence");
    }

    const { requirements } = response.data;
    return requirements;
  } catch (error) {
    console.error("Error retrieving requirements by evidence:", error);
    throw error;
  }
}
