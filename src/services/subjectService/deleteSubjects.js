import server from "../../config/server.js";

/**
 * Deletes multiple subjects by their IDs.
 * Sends a batch DELETE request to the server with an array of subject IDs and an authorization token.
 *
 * @async
 * @function deleteSubjects
 * @param {Object} params - Parameters for deleting subjects.
 * @param {Array<number>} params.subjectIds - An array of subject IDs to delete.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<boolean>} Returns `true` if the subjects were deleted successfully.
 * @throws {Error} If the response status is not 204 or if there is an error with the request.
 */
export default async function deleteSubjects({ subjectIds, token }) {
  try {
    const response = await server.delete("/subjects/batch", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { subjectIds },
    });

    if (response.status !== 204) {
      throw new Error("Response is NOT ok");
    }

    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
