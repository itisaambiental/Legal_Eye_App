import server from "../../config/server.js";

/**
 * Retrieves a list of all subjects from the backend.
 * Sends a GET request to the /subjects endpoint.
 *
 * @async
 * @function getSubjects
 * @param {string} token - The authorization token for the request.
 *
 * @returns {Promise<Array>} The list of all subjects returned from the server.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function getSubjects(token) {
  try {
    const response = await server.get("/subjects", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to fetch subjects");
    }

    return response.data.subjects;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
