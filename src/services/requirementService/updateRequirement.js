import server from "../../config/server.js";

/**
 * Updates an existing requirement with the provided details.
 * Sends a PATCH request with updated requirement data to the backend.
 *
 * @async
 * @function updateRequirement
 * @param {Object} params - Parameters for updating a requirement.
 * @param {string} params.id - The ID of the requirement to update.
 * @param {string} [params.subjectId] - The ID of the subject linked to the requirement (optional).
 * @param {Array<string>} [params.aspectsIds] - An array of aspect IDs linked to the requirement (optional).
 * @param {string} [params.requirementNumber] - The unique number identifying the requirement (optional).
 * @param {string} [params.requirementName] - The name/title of the requirement (optional).
 * @param {string} [params.mandatoryDescription] - The mandatory description of the requirement (optional).
 * @param {string} [params.complementaryDescription] - The complementary description (optional).
 * @param {string} [params.mandatorySentences] - The mandatory sentences associated with the requirement (optional).
 * @param {string} [params.complementarySentences] - The complementary sentences (optional).
 * @param {string} [params.mandatoryKeywords] - The mandatory keywords related to the requirement (optional).
 * @param {string} [params.complementaryKeywords] - The complementary keywords related to the requirement (optional).
 * @param {string} [params.condition] - The requirement condition ('Crítica', 'Operativa', 'Recomendación', 'Pendiente') (optional).
 * @param {string} [params.evidence] - The type of evidence required ('Trámite', 'Registro', 'Específico', 'Documento') (optional).
 * @param {string} [params.periodicity] - The periodicity of the requirement ('Anual', '2 años', 'Por evento', 'Única vez') (optional).
 * @param {string} [params.requirementType] - The type of requirement (optional).
 * @param {string} params.token - The authorization token for the request.
 *
 * @returns {Promise<Object>} - The updated requirement data returned from the server.
 * @throws {Error} - If the response status is not 200 or if there is an error with the request.
 */
export default async function updateRequirement({
  id,
  subjectId,
  aspectsIds,
  requirementNumber,
  requirementName,
  mandatoryDescription,
  complementaryDescription,
  mandatorySentences,
  complementarySentences,
  mandatoryKeywords,
  complementaryKeywords,
  condition,
  evidence,
  specifyEvidence,
  periodicity,
  specifyPeriodicity,
  requirementType,
  token,
}) {
  try {
    const data = {
      ...(subjectId && { subjectId }),
      ...(aspectsIds && { aspectsIds: JSON.stringify(aspectsIds.map(Number)) }), 
      ...(requirementNumber && { requirementNumber }),
      ...(requirementName && { requirementName }),
      ...(mandatoryDescription && { mandatoryDescription }),
      ...(complementaryDescription && { complementaryDescription }),
      ...(mandatorySentences && { mandatorySentences }),
      ...(complementarySentences && { complementarySentences }),
      ...(mandatoryKeywords && { mandatoryKeywords }),
      ...(complementaryKeywords && { complementaryKeywords }),
      ...(condition && { condition }),
      ...(evidence && { evidence }),
      ...(specifyEvidence && { specifyEvidence }),
      ...(periodicity && { periodicity }),
      ...(specifyPeriodicity && { specifyPeriodicity }),
      ...(requirementType && { requirementType })
    };
    const response = await server.patch(`/requirement/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to update requirement");
    }

    const { requirement } = response.data;
    return requirement;
  } catch (error) {
    console.error("Error updating requirement:", error);
    throw error;
  }
}
