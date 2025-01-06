// src/server/subjectservice/getSubjectById.js
import server from "../../config/server.js";

/**
 * Retrieves a specific subject by its ID.
 * Sends a GET request to the backend to fetch a specific subject by ID.
 * 
 * @async
 * @function getSubjectById
 * @param {Object} params - Parameters for retrieving the subject.
 * @param {number} params.subjectId - The ID of the subject to retrieve.
 * @param {string} params.token - The authorization token for the request.
 * 
 * @returns {Promise<Object>} The subject data returned from the server.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function getSubjectById({ subjectId, token }) {
    try {
        const response = await server.get(`/subject/${subjectId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        if (response.status !== 200) {
            throw new Error('Failed to retrieve subject');
        }

        return response.data.subject;

    } catch (error) {
        console.error(error);
        throw error;
    }
}
