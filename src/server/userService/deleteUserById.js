import server from "../config/server";

export default async function deleteUserById({ id, token }) {
    try {
        const response = await server.delete(`/user/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status !== 204) {
            throw new Error('Response is NOT ok');
        }

        return true

    } catch (error) {
        console.error(error);
        throw error;
    }
}
