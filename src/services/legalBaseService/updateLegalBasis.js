import server from "../../config/server.js";

/**
 * Updates a legal basis record with the provided details.
 * Sends a PATCH request with the data and optional file to the backend.
 *
 * @async
 * @function updateLegalBasis
 * @param {Object} params - Parameters for updating a legal basis record.
 * @param {number} params.id - The ID of the legal basis to update.
 * @param {string} [params.legalName] - The new legal name (optional).
 * @param {string} [params.abbreviation] - The new abbreviation (optional).
 * @param {number} [params.subjectId] - The new subject ID (optional).
 * @param {Array<number>} [params.aspectsIds] - The new aspects IDs (optional).
 * @param {string} [params.classification] - The new classification (optional).
 * @param {string} [params.jurisdiction] - The new jurisdiction (optional).
 * @param {string} [params.state] - The new state (optional).
 * @param {string} [params.municipality] - The new municipality (optional).
 * @param {string} [params.lastReform] - The last reform date (optional).
 * @param {boolean} [params.extractArticles=false] - Whether to extract articles from the document.
 * @param {boolean} [params.removeDocument] - Flag to indicate whether to remove the document (optional).
 * @param {File} [params.document] - The new document file (optional).
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<{ jobId?: string, legalBasis: Array<Object> }>}  An object containing the jobId and updated legal basis data.
 * @throws {Error} If the response status is not 200 or if there is an error with the request.
 */
export default async function updateLegalBasis({
  id,
  legalName,
  abbreviation,
  subjectId,
  aspectsIds,
  classification,
  jurisdiction,
  state = null,
  municipality = null,
  lastReform,
  extractArticles = false,
  removeDocument,
  document = null,
  token,
}) {
  try {
    const formData = new FormData();

    if (legalName) formData.append("legalName", legalName);
    if (abbreviation) formData.append("abbreviation", abbreviation);
    if (subjectId) formData.append("subjectId", subjectId);
    if (aspectsIds) formData.append("aspectsIds", JSON.stringify(aspectsIds));
    if (classification) formData.append("classification", classification);
    if (jurisdiction) formData.append("jurisdiction", jurisdiction);
    if (state) formData.append("state", state);
    if (municipality) formData.append("municipality", municipality);
    if (lastReform) formData.append("lastReform", lastReform);
    formData.append("extractArticles", String(extractArticles));
    if (document) formData.append("document", document);
    if (removeDocument !== undefined)
      formData.append("removeDocument", String(removeDocument));

    const response = await server.patch(`/legalBasis/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status !== 200) {
      throw new Error("Response is NOT ok");
    }

    const { jobId, legalBasis } = response.data;
    return { jobId, legalBasis };
  } catch (error) {
    console.error("Error updating legal basis:", error);
    throw error;
  }
}
