import server from "../config/server";

export default async function resetPassword(gmail) {
    try {
        const response = await server.post('/user/reset-password', {
            gmail,
        });

        if (response.status !== 200) {
            throw new Error('Response is NOT ok');
        }

       return response.status;


    } catch (error) {
        console.error(error);
        throw error;
    }
}