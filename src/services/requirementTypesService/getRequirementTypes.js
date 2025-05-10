import server from "../../config/server.js";

/**
 * Retrieves all requirement types.
 * Sends a GET request to fetch all requirement types from the backend.
 *
 * @async
 * @function getRequirementTypes
 * @param {Object} params - Parameters for retrieving the requirement types.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Array<Object>>} The array of requirement types returned from the server.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function getRequirementTypes({ token }) {
  try {
    const response = await server.get("/requirement-types", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to retrieve requirement types");
    }

    const { requirementTypes } = response.data;
    return requirementTypes;
  } catch (error) {
    console.error("Error retrieving requirement types:", error);
    throw error;
  }
}
