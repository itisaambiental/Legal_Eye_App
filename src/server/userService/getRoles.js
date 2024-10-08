import server from "../config/server";

export default async function getRoles({ token }) {
    try {
        const response = await server.get('/roles/', {
            headers: {
                Authorization: `Bearer ${token}`  
            }
        });

        if (response.status !== 200) {
            throw new Error('Response is NOT ok');
        }

        const { roles } = response.data;
        return roles;  
    } catch (error) {
        console.error('Error retrieving users:', error);
        throw error;
    }
}
