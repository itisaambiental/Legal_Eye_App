import server from "../../config/server.js";
/**
 * Retrieves all aspects associated with a specific subject.
 * Sends a GET request to the backend to fetch aspects by subject.
 *
 * @async
 * @function getAspectsBySubject
 * @param {Object} params - Parameters for retrieving aspects.
 * @param {number} params.subjectId - The ID of the subject to retrieve aspects for.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array<Object>>} The list of aspects associated with the subject.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function getAspectsBySubject({ subjectId, token }) {
  try {
    const response = await server.get(`/subjects/${subjectId}/aspects`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to retrieve aspects");
    }
    const { aspects } = response.data;
    return aspects;
  } catch (error) {
    console.error("Error retrieving aspects by subject:", error);
    throw error;
  }
}
