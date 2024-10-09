import server from "../config/server";

export default async function getUsers({ token }) {
    try {
        const response = await server.get('/users/', {
            headers: {
                Authorization: `Bearer ${token}`  
            }
        });

        if (response.status !== 200) {
            throw new Error('Response is NOT ok');
        }

        const { users } = response.data;
        return users;  
    } catch (error) {
        console.error(error);
        throw error;
    }
}
