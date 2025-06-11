import server from "../../config/server.js";

/**
 * Creates a new requirement identification by sending a POST request to the backend.
 *
 * @async
 * @function createReqIdentification
 * @param {Object} params - Parameters for creating a requirement identification.
 * @param {string} params.reqIdentificationName - Name of the requirement identification.
 * @param {string} params.reqIdentificationDescription - Description of the requirement identification.
 * @param {number[]} params.legalBasisIds - Array of legal basis IDs to be associated.
 * @param {string} params.intelligenceLevel - Intelligence level for requirement analysis ("High" or "Low").
 * @param {string} params.token - Authorization token for the request.
 *
 * @returns {Promise<{ reqIdentificationId: number, jobId: number | string }>} - The created identification ID and background job ID.
 * @throws {Error} - If the request fails or the response status is not 201.
 */
export default async function createReqIdentification({
  reqIdentificationName,
  reqIdentificationDescription,
  legalBasisIds,
  intelligenceLevel,
  token,
}) {
  try {
    const response = await server.post(
      "/req-identification",
      {
        reqIdentificationName,
        reqIdentificationDescription,
        legalBasisIds,
        intelligenceLevel,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 201) {
      throw new Error("Failed to create requirement identification");
    }

    const { reqIdentificationId, jobId } = response.data;
    return { reqIdentificationId, jobId };
  } catch (error) {
    console.error("Error creating requirement identification:", error);
    throw error;
  }
}
