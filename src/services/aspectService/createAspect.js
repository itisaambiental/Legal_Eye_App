import server from "../../config/server.js";

/**
 * Creates a new aspect associated with a specific subject.
 * Sends a POST request with aspect data to the backend.
 *
 * @async
 * @function createNewAspect
 * @param {Object} params - Parameters for creating a new aspect.
 * @param {number} params.subjectId - The ID of the subject to link this aspect to.
 * @param {string} params.aspectName - The name of the aspect.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Object>} The created aspect data returned from the server.
 * @throws {Error} If the response status is not 201 or if there is an error with the request.
 */
export default async function createNewAspect({
  subjectId,
  aspectName,
  token,
}) {
  try {
    const response = await server.post(
      `/subjects/${subjectId}/aspects`,
      { aspectName },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status !== 201) {
      throw new Error("Failed to create aspect");
    }
    const { aspect } = response.data;
    return aspect;
  } catch (error) {
    console.error("Error creating new aspect:", error);
    throw error;
  }
}
