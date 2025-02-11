import server from "../../config/server.js";

/**
 * Fetches a list of roles from the server.
 * Sends a GET request to retrieve available user roles, using an authorization token.
 *
 * @async
 * @function getRoles
 * @param {Object} params - Parameters for fetching roles.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array<Object>>} A list of roles retrieved from the server.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function getRoles({ token }) {
  try {
    const response = await server.get("/roles/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("Response is NOT ok");
    }

    const { roles } = response.data;
    return roles;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
}
