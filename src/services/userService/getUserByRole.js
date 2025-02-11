import server from "../../config/server.js";

/**
 * Fetches a list of users by their role ID from the server.
 * Sends a GET request to retrieve users with a specified role, using an authorization token.
 *
 * @async
 * @function getUserByRoleId
 * @param {Object} params - Parameters for fetching users by role.
 * @param {number} params.roleId - The role ID to filter users by.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array<Object>>} A list of users with the specified role.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function getUserByRoleId({ roleId, token }) {
  try {
    const response = await server.get(`/users/role/${roleId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("Response is NOT ok");
    }

    const { users } = response.data;
    return users;
  } catch (error) {
    console.error("Error fetching users by role ID:", error);
    throw error;
  }
}
