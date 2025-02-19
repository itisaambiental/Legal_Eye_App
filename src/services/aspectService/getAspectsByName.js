import server from "../../config/server.js";

/**
 * Retrieves a list of aspects by name for a specific subject.
 * Sends a GET request to the backend to fetch aspects by name and subject ID.
 *
 * @async
 * @function getAspectsByName
 * @param {Object} params - Parameters for retrieving aspects.
 * @param {number} params.subjectId - The ID of the subject to filter aspects by.
 * @param {string} params.aspectName - The name or partial name of the aspects to search for.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array<Object>>} An array of aspects matching the criteria.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function getAspectsByName({
  subjectId,
  aspectName,
  token,
}) {
  try {
    const response = await server.get(`/subjects/${subjectId}/aspects/name`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        aspectName,
      },
    });
    if (response.status !== 200) {
      throw new Error("Failed to retrieve aspects by name");
    }
    const { aspects } = response.data;
    return aspects;
  } catch (error) {
    console.error("Error retrieving aspects by name:", error);
    throw error;
  }
}
