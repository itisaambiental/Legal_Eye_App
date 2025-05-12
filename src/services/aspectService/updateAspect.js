import server from "../../config/server.js";

/**
 * Updates an aspect's information by its ID.
 * Sends a PATCH request to the /aspects/:id endpoint with updated data.
 *
 * @async
 * @function updateAspect
 * @param {Object} params - Parameters for updating an aspect.
 * @param {number} params.id - The ID of the aspect to update.
 * @param {string} params.aspectName - The new name of the aspect.
 * @param {number} params.order - The new order number of the aspect.
 * @param {string} params.abbreviation - The new abbreviation of the aspect.
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Object>} The updated aspect data returned from the server.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function updateAspect({
  id,
  aspectName,
  order: orderIndex,
  abbreviation,
  token,
}) {
  try {
    const response = await server.patch(
      `/aspect/${id}`,
      { aspectName, orderIndex, abbreviation },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to update aspect");
    }

    const { aspect } = response.data;
    return aspect;
  } catch (error) {
    console.error("Error updating aspect:", error);
    throw error;
  }
}
