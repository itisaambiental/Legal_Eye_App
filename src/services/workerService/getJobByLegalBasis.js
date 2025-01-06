import server from "../../config/server.js";

/**
 * Retrieves the job status for a specific Legal Basis ID.
 * Sends a GET request to the /api/jobs/articles/legalBasis/:legalBasisId endpoint.
 *
 * @async
 * @function getJobByLegalBasis
 * @param {Object} params - Parameters for retrieving the job status.
 * @param {string} params.legalBasisId - The ID of the legal basis to check for jobs.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Object>} The job status object containing hasPendingJobs and jobId.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function getJobByLegalBasis({ legalBasisId, token }) {
  try {
    const response = await server.get(`/jobs/articles/legalBasis/${legalBasisId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to retrieve job status");
    }

    const { hasPendingJobs, jobId } = response.data;
    return { hasPendingJobs, jobId };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
