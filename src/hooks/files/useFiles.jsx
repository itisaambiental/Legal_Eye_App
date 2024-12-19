import { useCallback } from "react";
import getDocumentByUrl from "../../services/legalBaseService/getDocumentByUrl";

/**
 * Custom hook for managing file downloads and errors.
 *
 * @returns {Object} - Contains downloadFile function, and error.
 */
export const useFiles = () => {
  /**
   * Downloads a file from a given URL.
   *
   * @param {string} url - The signed URL to fetch the file.
   * @returns {Promise<Blob|null>} - Resolves with the file Blob or null on error.
   */
  const downloadFile = useCallback(async (url) => {
    try {
      const fileBlob = await getDocumentByUrl(url);
      return { success: true, fileBlob };
    } catch (error) {
      console.error("Error downloading file:", error);
      let errorMessage;
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage =
              "El enlace de descarga es incorrecto. Recargue la página e intente de nuevo.";
            break;
          case 403:
              errorMessage =
                "El enlace ha expirado o no tienes permisos para descargar el documento. Contacte a los administradores del sistema..";
            break;
          case 404:
            errorMessage =
              "El documento solicitado no existe. Recargue la página e intente de nuevo.";
            break;
          case 408:
            errorMessage =
              "La descarga tardó demasiado en completarse. Intente nuevamente.";
            break;
          case 413:
            errorMessage =
              "El documento excede el tamaño permitido. Contacte a los administradores del sistema.";
            break;
          case 500:
            errorMessage = "Hubo un problema en el servidor. Intente más tarde nuevamente.";
            break;
          default:
            errorMessage = "Ocurrió un problema inesperado. Intente más tarde nuevamente.";
        }
      } else if (error.message === "Network Error") {
        errorMessage = "Error de conexión durante la descarga. Verifique su conexión a internet.";
      } else {
        errorMessage = "Ocurrió un error inesperado. Intente nuevamente.";
      }
  
      return { success: false, error: errorMessage };
    }
  }, []);
  
  

  return { downloadFile };
};
