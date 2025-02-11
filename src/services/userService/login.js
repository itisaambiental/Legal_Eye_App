import server from "../../config/server.js";

/**
 * Logs in a user using email and password authentication.
 * Sends a POST request with the user's email and password to authenticate.
 *
 * @async
 * @function login_user
 * @param {Object} params - Parameters for email/password login.
 * @param {string} params.email - The user's email for authentication.
 * @param {string} params.password - The user's password for authentication.
 *
 * @returns {Promise<Object>} An object containing the user's JWT token.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function login_user({ email, password }) {
  try {
    const response = await server.post("/user/login", {
      gmail: email,
      password,
    });

    if (response.status !== 200) {
      throw new Error("Response is NOT ok");
    }

    const { token } = response.data;
    return { token };
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
}
