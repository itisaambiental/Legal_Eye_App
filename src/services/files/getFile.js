import server from "../../config/server.js"

/**
 * Fetches a file from a given URL and returns it as a base64 buffer.
 *
 * @async
 * @function getFile
 * @param {string} url - The URL of the file to fetch.
 * @param {string} token - The authorization token for the request.
 * @returns {Promise<{ file: string, contentType: string }>} - The file buffer in base64 and its content type.
 * @throws {Error} If the request fails.
 */
export default async function getFile(url, token) {
  try {
    const response = await server.get("/files/", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      params: { url },
    })

    if (response.status !== 200) {
      throw new Error("Failed to fetch file")
    }
    const { file, contentType } = response.data
    return { file, contentType }
  } catch (error) {
    console.error("Error fetching file:", error)
    throw error
  }
}
