import server from "../../config/server.js";

/**
 * Creates a new requirement with the provided details.
 * Sends a POST request with requirement data to the backend.
 *
 * @async
 * @function createRequirement
 * @param {Object} params - Parameters for creating a new requirement.
 * @param {string|number} params.subjectId - The ID of the subject linked to the requirement.
 * @param {Array<string|number>} params.aspectsIds - An array of aspect IDs linked to the requirement.
 * @param {string} params.requirementNumber - The unique number identifying the requirement.
 * @param {string} params.requirementName - The name/title of the requirement.
 * @param {string} params.mandatoryDescription - The mandatory description of the requirement.
 * @param {string} [params.complementaryDescription] - The complementary description (optional).
 * @param {string} [params.mandatorySentences] - The mandatory sentences associated with the requirement (optional).
 * @param {string} [params.complementarySentences] - The complementary sentences (optional).
 * @param {string} [params.mandatoryKeywords] - The mandatory keywords related to the requirement (optional).
 * @param {string} [params.complementaryKeywords] - The complementary keywords related to the requirement (optional).
 * @param {string} params.condition - The requirement condition.
 * @param {string} params.evidence - The type of evidence required.
 * @param {string} params.periodicity - The periodicity of the requirement.
 * @param {string} params.requirementType - The type of requirement.
 * @param {string} params.jurisdiction - The jurisdiction.
 * @param {string} [params.state] - The state associated with the requirement (optional).
 * @param {string} [params.municipality] - The municipality associated with the requirement (optional).
 * @param {string} params.token - The authorization token.
 * @returns {Promise<Object>} - The created requirement data returned from the server.
 * @throws {Error} - If the response status is not 201 or if there is an error with the request.
 */
export default async function createRequirement({
  subjectId,
  aspectsIds,
  requirementNumber,
  requirementName,
  mandatoryDescription,
  complementaryDescription = null,
  mandatorySentences = null,
  complementarySentences = null,
  mandatoryKeywords = null,
  complementaryKeywords = null,
  condition,
  evidence,
  periodicity,
  requirementType,
  jurisdiction,
  state = null,
  municipality = null,
  token,
}) {
  try {
    const data = {
      subjectId,
      aspectsIds: JSON.stringify(aspectsIds.map(Number)),
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
      periodicity,
      requirementType,
      jurisdiction,
      state,
      municipality,
    };

    const response = await server.post("/requirements", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status !== 201) {
      throw new Error("Failed to create requirement");
    }

    const { requirement } = response.data;
    return requirement;
  } catch (error) {
    console.error("Error creating requirement:", error);
    throw error;
  }
}
