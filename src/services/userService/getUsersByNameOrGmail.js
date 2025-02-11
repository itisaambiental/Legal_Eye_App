import server from "../../config/server.js";

/**
 * Fetches a list of users by name or email from the server.
 * Sends a GET request with the specified query parameter and an authorization token.
 *
 * @async
 * @function getUsersByNameOrGmail
 * @param {Object} params - Parameters for fetching users by name or email.
 * @param {string} params.nameOrEmail - The name or email of the user to search for.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array<Object>>} A list of users matching the specified name or email.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function getUsersByNameOrGmail({ nameOrEmail, token }) {
  try {
    const response = await server.get("/users/search/filter", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        nameOrEmail,
      },
    });
    if (response.status !== 200) {
      throw new Error("Response is NOT ok");
    }
    const { users } = response.data;
    return users;
  } catch (error) {
    console.error("Error fetching users by name or email:", error);
    throw error;
  }
}
