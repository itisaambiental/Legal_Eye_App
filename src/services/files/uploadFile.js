import server from "../../config/server.js"

/**
 * Uploads a file to the backend.
 *
 * @async
 * @function uploadFile
 * @param {File} file - The file to be uploaded.
 * @param {string} token - The authorization token for the request.
 * @returns {Promise<string>} The uploaded file URL.
 * @throws {Error} If the upload fails.
 */
export default async function uploadFile(file, token) {
  try {
    const formData = new FormData()
    formData.append("file", file)
    const response = await server.post("/files/", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })
    if (response.status !== 201) {
      throw new Error("Failed to upload file")
    }
    const { url } = response.data
    return url
  } catch (error) {
    console.error("Error uploading file:", error)
    throw error
  }
}
