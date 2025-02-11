// src/server/subjectservice/getSubjectByName.js
import server from "../../config/server.js";

/**
 * Retrieves a specific subject by its name.
 * Sends a GET request to the backend to fetch a specific subject by name.
 *
 * @async
 * @function getSubjectByName
 * @param {Object} params - Parameters for retrieving the subject.
 * @param {string} params.subjectName - The name of the subject to retrieve.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array<Object>>}  The subject data returned from the server.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function getSubjectsByName({ subjectName, token }) {
  try {
    const response = await server.get(`/subjects/name`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        subjectName,
      },
    });
    if (response.status !== 200) {
      throw new Error("Failed to retrieve subject by name");
    }
    const { subjects } = response.data;
    return subjects;
  } catch (error) {
    console.error("Error retrieving subject by name:", error);
    throw error;
  }
}
