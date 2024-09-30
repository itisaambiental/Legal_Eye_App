import server from "../config/server";

export default async function verifyToken(token) {
    try {
        const response = await server.get(`/user/verify/${token}`);

        if (response.status !== 200) {
            throw new Error('Response is NOT ok');
        }
        return response.data.valid;

    } catch (error) {
        console.error(error);
        throw error;
    }
}
