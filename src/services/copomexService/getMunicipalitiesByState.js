import copomexAPI from "../../config/copomexAPI.js";

/**
 * Retrieves the list of municipalities for a given state from the COPOMEX API.
 * Sends a GET request to the "/get_municipio_por_estado/{state}" endpoint to fetch the data.
 *
 * @async
 * @function getMunicipalitiesByState
 * @param {string} state - The name of the Mexican state for which to retrieve municipalities.
 * @returns {Promise<string[]>} The list of municipalities in the given state.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function getMunicipalitiesByState( state ) {
  const stateEncodeURI = encodeURIComponent(state);
  try {
    const response = await copomexAPI.get(`/get_municipio_por_estado/${stateEncodeURI}`);
    if (response.status !== 200) {
      throw new Error("Failed to retrieve municipalities");
    }
    const { municipios } = response.data.response;
    return municipios;
  } catch (error) {
    console.error("Error retrieving municipalities for state:", state, error);
    throw error;
  }
}
