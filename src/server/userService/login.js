import server from "../config/server";

export default async function login_user({ email, password }) {
    try {
        const response = await server.post('/user/login', {
            gmail: email,
            password
        });

        if (response.status !== 200) {
            throw new Error('Response is NOT ok');
        }

        const { token } = response.data; 
        return { token };

    } catch (error) {
        console.error(error);
        throw error;
    }
}

