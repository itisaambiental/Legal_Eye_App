import server from "../config/server";

export default async function getUserById({ id, token }) {
    try {
        const response = await server.get(`/user/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status !== 200) {
            throw new Error('Response is NOT ok');
        }

       const { user } = response.data;
       return user;

    } catch (error) {
        console.error(error);
        throw error;
    }
}
