import server from "../../config/server.js";

/**
 * Creates a new legal basis associated with a specific subject and aspects.
 * Sends a POST request with legal basis data to the backend.
 *
 * @async
 * @function createNewLegalBasis
 * @param {Object} params - Parameters for creating a new legal basis.
 * @param {string} params.legalName - The name of the legal basis.
 * @param {string} params.abbreviation - The abbreviation of the legal basis.
 * @param {string} params.subjectId - The ID of the subject linked to the legal basis.
 * @param {Array<string>} params.aspectsIds - An array of aspect IDs linked to the legal basis.
 * @param {string} params.classification - The classification of the legal basis.
 * @param {string} params.jurisdiction - The jurisdiction of the legal basis.
 * @param {string} [params.lastReform] - The last reform date of the legal basis.
 * @param {boolean} [params.extractArticles] - Whether to extract articles from the document.
 * @param {Buffer|null} [params.document] - A file buffer representing the document (optional).
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<{ jobId?: string, legalBasis: Array<Object> }>} The created legal basis data returned from the server.
 * @throws {Error} If the response status is not 201 or if there is an error with the request.
 */
export default async function createLegalBasis({
    legalName,
    abbreviation,
    subjectId,
    aspectsIds,
    classification,
    jurisdiction,
    lastReform,
    extractArticles = false,
    document = null,
    token
}) {
    try {
        const formData = new FormData();
        formData.append("legalName", legalName);
        formData.append("abbreviation", abbreviation);
        formData.append("subjectId", subjectId);
        formData.append("aspectsIds", JSON.stringify(aspectsIds));
        formData.append("classification", classification);
        formData.append("jurisdiction", jurisdiction);
        formData.append("lastReform", lastReform);
        if (extractArticles) formData.append("extractArticles", String(extractArticles));
        if (document) {
                formData.append("document", document);
    }
        const response = await server.post("/api/legalBasis", formData, {
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'multipart/form-data' 
            }
        });

        if (response.status !== 201) {
            throw new Error("Failed to create legal basis");
        }

        const { jobId, legalBasis } = response.data;
        
        return { jobId, legalBasis };
    } catch (error) {
        console.error("Error creating legal basis:", error);
        throw error;
    }
}
