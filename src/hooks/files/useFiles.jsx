import { useCallback, useContext } from "react";
import Context from "../../context/userContext.jsx";
import { default as uploadFileService } from "../../services/files/uploadFile";
import getFile from "../../services/files/getFile";
import FileErrors from "../../errors/files/FileErrors";
import { saveAs } from "file-saver";
/**
 * Custom hook for managing file downloads and errors.
 *
 * @returns {Object} - Contains downloadFile function.
 */
export const useFiles = () => {
    const { jwt } = useContext(Context);
     /**
     * Uploads a file to the backend and returns the uploaded file URL.
     *
     * @param {File} file - The file to be uploaded.
     * @param {string} token - The authorization token for the request.
     * @returns {Promise<Object>} - Resolves with an object containing success status and file URL or error message.
     */
     const uploadFile = useCallback(async (file) => {
        try {
            const fileUrl = await uploadFileService(file, jwt);
            return { success: true, fileUrl };
        } catch (error) {
            const errorCode = error.response?.status;
            const serverMessage = error.response?.data?.message;
            const clientMessage = error.message;
            const handledError = FileErrors.handleError({
                code: errorCode,
                error: serverMessage,
                httpError: clientMessage,
            });
            return { success: false, error: handledError.message };
        }
    }, [jwt]);

       /**
     * Converts a base64 string to a Blob and triggers file download.
     *
     * @param {string} fileBase64 - The base64-encoded file data.
     * @param {string} contentType - The MIME type of the file.
     * @param {string} fileName - The name for the downloaded file.
     */
       const downloadBase64File = useCallback(async (fileBase64, contentType, fileName) => {
        const byteCharacters = atob(fileBase64);
        const byteNumbers = new Array(byteCharacters.length)
            .fill()
            .map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
        const fileBlob = new Blob([byteArray], { type: contentType });
        saveAs(fileBlob, fileName);
    }, []);

    /**
     * Downloads a file from a given URL.
     *
     * @param {string} url - The signed URL to fetch the file.
     * @returns {Promise<Object>} - Resolves with an object containing success status and fileBlob or error message.
     */
    const downloadFile = useCallback(async (url) => {
        try {
            const { file, contentType} = await getFile(url, jwt);
            return { success: true, file, contentType };
        } catch (error) {
            const errorCode = error.response?.status;
            const serverMessage = error.response?.data?.message;
            const clientMessage = error.message;
            const handledError = FileErrors.handleError({
                code: errorCode,
                error: serverMessage,
                httpError: clientMessage,
            });
            return { success: false, error: handledError.message };
        }
    }, [jwt]);

    return { uploadFile, downloadFile, downloadBase64File };
};
