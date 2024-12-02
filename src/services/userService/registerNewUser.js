import server from "../../config/server.js"

/**
 * Registers a new user with the provided details.
 * Sends a POST request with user data, including name, email, role ID, and an optional profile picture.
 * 
 * @async
 * @function registerNewUser
 * @param {Object} params - Parameters for registering a new user.
 * @param {string} params.name - The name of the user.
 * @param {string} params.email - The email of the user.
 * @param {number} params.role_id - The role ID of the user.
 * @param {File} [params.profile_picture] - The optional profile picture file of the user.
 * @param {string} params.token - The authorization token for the request.
 * 
 * @returns {Promise<Object>} The registered user data returned from the server.
 * @throws {Error} If the response status is not 201 or if there is an error with the request.
 */
export default async function registerNewUser({ name, email, role_id, profile_picture, token }) {
    try {
        const formData = new FormData()
    
        formData.append('name', name)
        formData.append('gmail', email)
        formData.append('roleId', role_id)
        
        if (profile_picture) {
            formData.append('profilePicture', profile_picture)
        }

        const response = await server.post('/user/register', formData, {
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'multipart/form-data' 
            }
        })

        if (response.status !== 201) {
            throw new Error('Response is NOT ok')
        }

        return response.data.user

    } catch (error) {
        console.error(error)
        throw error
    }
}
