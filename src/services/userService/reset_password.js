import server from "../../config/server.js";

/**
 * Initiates a password reset for a user based on their email.
 * Sends a POST request to trigger the password reset process.
 *
 * @async
 * @function resetPassword
 * @param {string} gmail - The user's email address for initiating the password reset.
 *
 * @returns {Promise<boolean>} True if the response status is 200.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function resetPassword(gmail) {
  try {
    const response = await server.post("/user/reset-password", {
      gmail,
    });

    if (response.status !== 200) {
      throw new Error("Response is NOT ok");
    }
    return true;
  } catch (error) {
    console.error("Error initiating password reset:", error);
    throw error;
  }
}
