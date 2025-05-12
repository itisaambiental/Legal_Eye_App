import server from "../../../config/server.js";

/**
 * Sends selected legal basis IDs to ACM Suite.
 * Initiates a background job for sending the legal basis.
 *
 * @async
 * @function sendLegalBasisService
 * @param {Object} params - Parameters for sending legal basis.
 * @param {Array<number>} params.legalBasisIds - Array of legal basis IDs to send.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<{ jobId: number | string }>} - The job ID for tracking the sending progress.
 * @throws {Error} - If the response status is not 200 or if there is a request error.
 */
export default async function sendLegalBasisService({ legalBasisIds, token }) {
  try {
    const response = await server.post("/jobs/legalBasis/", { legalBasisIds }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status !== 201) {
      throw new Error("Failed to create send job for legal basis");
    }
    const { jobId } = response.data;
    return { jobId };
  } catch (error) {
    console.error("Error sending legal basis:", error);
    throw error;
  }
}
