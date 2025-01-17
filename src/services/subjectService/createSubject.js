import server from "../../config/server.js";

/**
 * Creates a new subject in the system.
 * Sends a POST request with subject data to the backend.
 *
 * @async
 * @function createNewSubject
 * @param {Object} params - Parameters for creating a new subject.
 * @param {string} params.subjectName - The name of the subject.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Object>} The created subject data returned from the server.
 * @throws {Error} If the response status is not 201 or if there is an error with the request.
 */
export default async function createNewSubject({ subjectName, token }) {
  try {
    const response = await server.post(
      "/subjects",
      { subjectName },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status !== 201) {
      throw new Error("Failed to create subject");
    }
    return response.data.subject;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
