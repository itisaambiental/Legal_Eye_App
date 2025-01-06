import server from "../../config/server.js"

/**
 * Updates a user's information with the provided details.
 * Sends a PATCH request with user data, including optional fields such as name, email, role ID, profile picture, and a flag to remove the profile picture.
 * 
 * @async
 * @function updateUser
 * @param {Object} params - Parameters for updating a user.
 * @param {number} params.id - The ID of the user to update.
 * @param {string} [params.name] - The new name of the user (optional).
 * @param {string} [params.email] - The new email of the user (optional).
 * @param {number} [params.role_id] - The new role ID of the user (optional).
 * @param {File} [params.profile_picture] - The new profile picture file of the user (optional).
 * @param {boolean} [params.removePicture=false] - Flag to indicate whether to remove the profile picture (optional).
 * @param {string} params.token - The authorization token for the request.
 * 
 * @returns {Promise<Object>} An object containing the updated user data and, if available, a new token.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function updateUser({ id, name, email, role_id, profile_picture, token, removePicture }) {
    try {
      const formData = new FormData();
      
      if (name) formData.append('name', name);
      if (email) formData.append('gmail', email);
      if (role_id) formData.append('roleId', role_id);
      if (profile_picture) formData.append('profilePicture', profile_picture);
      if (removePicture !== undefined) formData.append('removePicture', removePicture);
  
      const response = await server.patch(`/user/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
  
      if (response.status !== 200) {
        throw new Error('Response is NOT ok');
      }
  
      return { 
        updatedUser: response.data.updatedUser, 
        token: response.data.token || null 
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
}
