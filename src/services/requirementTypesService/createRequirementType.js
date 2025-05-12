import server from "../../config/server.js";

/**
 * Creates a new requirement type in the system.
 * Sends a POST request with requirement type data to the backend.
 *
 * @async
 * @function createRequirementType
 * @param {Object} params - Parameters for creating a new requirement type.
 * @param {string} params.name - The name of the requirement type.
 * @param {string} params.description - The description of the requirement type.
 * @param {string} params.classification - The classification of the requirement type.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Object>} The created requirement type data returned from the server.
 * @throws {Error} If the response status is not 201 or if there is an error with the request.
 */
export default async function createRequirementType({
  name,
  description,
  classification,
  token,
}) {
  try {
    const response = await server.post(
      "/requirement-types",
      { name, description, classification },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status !== 201) {
      throw new Error("Failed to create requirement type");
    }

    const { requirementType } = response.data;
    return requirementType;
  } catch (error) {
    console.error("Error creating requirement type:", error);
    throw error;
  }
}
