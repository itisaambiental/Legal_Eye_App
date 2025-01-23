import server from "../../../config/server.js";

/**
 * Cancels a job by its ID.
 * Sends a DELETE request to the /api/jobs/articles/:jobId endpoint.
 *
 * @async
 * @function cancelJob
 * @param {Object} params - Parameters for canceling the job.
 * @param {string} params.jobId - The ID of the job to cancel.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<boolean>} - True if the job was successfully canceled.
 * @throws {Error} If the response status is not 204 or if there is an error with the request.
 */
export default async function cancelJob({ jobId, token }) {
  try {
    const response = await server.delete(`/jobs/articles/${jobId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 204) {
      throw new Error('Failed to cancel job');
    }

    return true;
  } catch (error) {
    console.error('Error canceling job:', error);
    throw error;
  }
}
