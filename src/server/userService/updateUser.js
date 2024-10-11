import server from "../config/server";

export default async function updateUser({ id, name, email, role_id, profile_picture, token }) {
    try {
        const formData = new FormData();
    
        if (name) formData.append('name', name);
        if (email) formData.append('gmail', email);
        if (role_id) formData.append('roleId', role_id);
        if (profile_picture) formData.append('profilePicture', profile_picture);

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
        console.error('Error updating user:', error);
        throw error;
    }
}
