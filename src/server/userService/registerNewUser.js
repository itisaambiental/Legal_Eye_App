import server from "../config/server";

export default async function registerNewUser({ name, email, role_id, profile_picture, token }) {
    try {
        const formData = new FormData();
    
        formData.append('name', name);
        formData.append('gmail', email);
        formData.append('roleId', role_id);
        
        if (profile_picture) {
            formData.append('profilePicture', profile_picture);
        }

        const response = await server.post('/user/register', formData, {
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'multipart/form-data' 
            }
        });

        if (response.status !== 201) {
            throw new Error('Response is NOT ok');
        }

        return response.data.user;

    } catch (error) {
        console.error(error);
        throw error;
    }
}
