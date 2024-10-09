import server from "../config/server";

export default async function deleteUsers({ userIds, token }) {
    try {
        const response = await server.delete('/users/batch', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: { userIds }
        });

        if (response.status !== 204) {
            throw new Error('Response is NOT ok');
        }

        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
