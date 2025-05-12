import server from "../../../config/server.js";

/**
 * Retrieves the status of a send legal basis job from ACM Suite.
 *
 * @async
 * @function getSendLegalBasisJobStatus
 * @param {Object} params - Parameters for retrieving job status.
 * @param {string|number} params.jobId - The job ID to track.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<{
*   message: string,
*   jobProgress?: number,
*   error?: string
* }>} - The job status object containing:
* - `message` (string): General message about the job status.
* - `jobProgress` (number, optional): The progress percentage of the job.
* - `error` (string, optional): Error details if the job encountered an issue.
*
* @throws {Error} If the response status is not 200 or if there is an error with the request.
*/
export default async function getSendLegalBasisJobStatus({ jobId, token }) {
  try {
    const response = await server.get(`/jobs/legalBasis/${jobId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status !== 200) {
        throw new Error("Failed to retrieve job status");
      }
      const { message, jobProgress, error } = response.data;
      return {
        message,
        ...(jobProgress !== undefined && { jobProgress }),
        ...(error !== undefined && { error }),
      };
    } catch (error) {
      console.error("Error retrieving job status:", error);
      throw error;
    }
}
