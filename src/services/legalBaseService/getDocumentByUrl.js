import axios from "axios";

/**
 * Fetches a document By URL.
 *
 * @param {string} url - The URL to fetch the document.
 */
export default async function fetchDocument (url){
    try {
      const response = await axios.get(url, {
        responseType: "blob",
      });
      const fileBlob = new Blob([response.data], { type: response.headers["content-type"] });
      const fileUrl = URL.createObjectURL(fileBlob);
      return fileUrl
    } catch (error) {
      console.error("Error getting document:", error);
      throw error
    }
};