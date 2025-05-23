import server from "../../config/server.js";

/**
 * Creates a new subject in the system.
 * Sends a POST request with subject data to the backend.
 *
 * @async
 * @function createNewSubject
 * @param {Object} params - Parameters for creating a new subject.
 * @param {string} params.subjectName - The name of the subject.
 * @param {number} params.order - The order number of the subject.
 * @param {string} params.abbreviation - The abbreviation of the subject.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Object>} The created subject data returned from the server.
 * @throws {Error} If the response status is not 201 or if there is an error with the request.
 */
export default async function createNewSubject({
  subjectName,
  order: orderIndex,
  abbreviation,
  token,
}) {
  try {
    const response = await server.post(
      "/subjects",
      { subjectName, orderIndex, abbreviation },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status !== 201) {
      throw new Error("Failed to create subject");
    }
    const { subject } = response.data;
    return subject;
  } catch (error) {
    console.error("Error creating new subject:", error);
    throw error;
  }
}
