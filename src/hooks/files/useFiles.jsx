import { useCallback } from "react";
import getDocumentByUrl from "../../services/legalBaseService/getDocumentByUrl";
import FileErrors from "../../errors/files/FileErrors";

/**
 * Custom hook for managing file downloads and errors.
 *
 * @returns {Object} - Contains downloadFile function.
 */
export const useFiles = () => {
    /**
     * Downloads a file from a given URL.
     *
     * @param {string} url - The signed URL to fetch the file.
     * @returns {Promise<Object>} - Resolves with an object containing success status and fileBlob or error message.
     */
    const downloadFile = useCallback(async (url) => {
        try {
            const fileBlob = await getDocumentByUrl(url);
            return { success: true, fileBlob };
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
    }, []);

    return { downloadFile };
};
