import axios from "axios";

/**
 * Fetches a document By URL.
 *
 * @param {string} url - The URL to fetch the document.
 * @returns {Promise<Blob>} - A promise resolving to the fetched Blob.
 */
export default async function getDocumentByUrl(url) {
    try {
      const response = await axios.get(url, {
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      console.error("Error getting document:", error);
      throw error;
    }
  }
  