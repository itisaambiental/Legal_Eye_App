import server from "../../../config/server.js";

/**
 * Updates a requirement type's information by its ID.
 * Sends a PATCH request to the /requirement-type/:id endpoint with updated data.
 *
 * @async
 * @function updateRequirementType
 * @param {Object} params - Parameters for updating a requirement type.
 * @param {number} params.id - The ID of the requirement type to update.
 * @param {string} params.name - The new name of the requirement type.
 * @param {string} params.description - The new description of the requirement type.
 * @param {string} params.classification - The new classification of the requirement type.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Object>} The updated requirement type data returned from the server.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function updateRequirementType({ id, name, description, classification, token }) {
  try {
    const response = await server.patch(
      `/requirement-type/${id}`,
      { name, description, classification },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to update requirement type");
    }

    const { requirementType } = response.data;
    return requirementType;
  } catch (error) {
    console.error("Error updating requirement type:", error);
    throw error;
  }
}
