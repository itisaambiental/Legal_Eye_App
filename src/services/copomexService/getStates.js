import copomexAPI from "../../config/copomexAPI.js";

/**
 * Retrieves the official list of states from the COPOMEX API.
 * Sends a GET request to the "/get_estados" endpoint to fetch the data.
 *
 * @async
 * @function getStates
 * @returns {Promise<string[]>} The list of Mexican states.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function getStates() {
  try {
    const response = await copomexAPI.get('/get_estados');
    if (response.status !== 200) {
      throw new Error("Failed to retrieve states");
    }
    const { estado } = response.data.response;
    return estado;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
