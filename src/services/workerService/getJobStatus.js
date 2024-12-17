import server from "../../config/server.js";

/**
 * Retrieves the status of a job by its ID.
 * Sends a GET request to the /api/jobs/articles/:id endpoint.
 *
 * @async
 * @function getJobStatus
 * @param {Object} params - Parameters for retrieving the job status.
 * @param {string} params.id - The ID of the job to retrieve.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Object>} The job status object containing message, progress, or error details.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function getJobStatus({ id, token }) {
  try {
    const response = await server.get(`/jobs/articles/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error('Failed to retrieve job status');
    }
    const { message, jobProgress, error } = response.data;
    return {
      message,
      ...(jobProgress !== undefined && { jobProgress }),
      ...(error !== undefined && { error }),
    };
  } catch (error) {
    console.error("Error retrieving job status", error.message);
    throw error;
  }
}
