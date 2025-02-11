import server from "../../config/server.js";

/**
 * Updates a subject's information by its ID.
 * Sends a PATCH request to the /subject/:id endpoint with updated data.
 *
 * @async
 * @function updateSubject
 * @param {Object} params - Parameters for updating a subject.
 * @param {number} params.id - The ID of the subject to update.
 * @param {string} params.subjectName - The new name of the subject.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Object>} The updated subject data returned from the server.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function updateSubject({ id, subjectName, token }) {
  try {
    const response = await server.patch(
      `/subject/${id}`,
      { subjectName },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to update subject");
    }
    const { updatedSubject } = response.data;
    return updatedSubject
  } catch (error) {
    console.error("Error updating subject:", error);
    throw error;
  }
}
