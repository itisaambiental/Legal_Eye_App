
import server from "../config/server";

export default async function sendNewPassword(gmail, code) {
    try {
        const response = await server.post('/user/verify-code', {
            gmail, 
            code
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