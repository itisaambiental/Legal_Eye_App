import server from "../../config/server.js"

/**
 * Retrieves all articles associated with a specific legal basis.
 * Sends a GET request to the backend to fetch articles by legal basis ID.
 * 
 * @async
 * @function getArticlesByLegalBasis
 * @param {Object} params - Parameters for retrieving articles.
 * @param {number} params.legalBaseId - The ID of the legal basis to retrieve articles for.
 * @param {string} params.token - The authorization token for the request.
 * 
 * @returns {Promise<Array>} The list of articles associated with the legal basis.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function getArticlesByLegalBasis({ legalBaseId, token }) {
    try {
        const response = await server.get(`/articles/legalBasis/${legalBaseId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })

        if (response.status !== 200) {
            throw new Error('Failed to retrieve articles')
        }

        return response.data.articles

    } catch (error) {
        console.error(error)
        throw error
    }
}
