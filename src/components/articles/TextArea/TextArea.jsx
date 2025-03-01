import PropTypes from "prop-types";
import { Editor } from "@tinymce/tinymce-react";
import { useFiles } from "../../../hooks/files/useFiles";
import { toast } from "react-toastify";
import { Spinner } from "@heroui/react";
import check from "../../../assets/check.png";
import axios from "axios";

const API_KEY = import.meta.env.VITE_TINYMCE;

/**
 * Text area component with TinyMCE rich text editor.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {string} props.value - Content of the editor.
 * @param {Function} props.onChange - Function to handle content changes.
 * @param {string} [props.placeholder] - Placeholder text for the editor.
 * @param {Function} props.setIsUploading - Function to set uploading state (true when uploading, false otherwise).
 * @returns {JSX.Element} - TinyMCE rich text editor component.
 */
function TextArea({ value, onChange, placeholder, setIsUploading }) {
  const { uploadFile } = useFiles();

  /**
   * Handles file selection and uploads in TinyMCE.
   *
   * @param {Function} callback - TinyMCE function to insert the image into the editor.
   */
  const handleFilePicker = async (callback) => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.onchange = async function () {
      const file = this.files?.[0];
      if (!file) return;
      const fileUrl = await handleFileUpload(file);
      if (fileUrl) callback(fileUrl, { title: file.name });
    };
    input.click();
  };

  /**
   * Handles pasted content, detects Blob URLs, uploads the image, and replaces them with uploaded URLs.
   * If the upload fails, removes the image from the document.
   *
   * @param {Editor} editor - TinyMCE editor API.
   * @param {Object} args - Paste content arguments.
   */
  const handlePastePreprocess = async (editor, args) => {
    let content = args.content;
    const blobUrlRegex = /<img[^>]+src=["'](blob:http[^"']+)["']/gi;
    const matches = [...content.matchAll(blobUrlRegex)];
    if (matches.length > 0) {
      for (const match of matches) {
        const blobUrl = match[1];
        const fileUrl = await handleBlobImageUpload(blobUrl);
        const imgElement = editor.dom.select(`img[src="${blobUrl}"]`)[0];
        if (fileUrl) {
          if (imgElement) {
            editor.dom.setAttrib(imgElement, "src", fileUrl);
          }
        } else {
          if (imgElement) {
            editor.dom.remove(imgElement);
          }
        }
      }
    }
  };

  /**
   * Converts a Blob URL to a File object and uploads it to the server.
   *
   * @param {string} blobUrl - Blob URL of the pasted image.
   * @returns {Promise<string|null>} - Returns the uploaded file URL or null if the upload fails.
   */
  const handleBlobImageUpload = async (blobUrl) => {
    try {
      const response = await axios.get(blobUrl, { responseType: "blob" });
      const blob = response.data;
      const file = new File([blob], `image-${Date.now()}.png`, {
        type: blob.type,
      });
      return await handleFileUpload(file);
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  /**
   * Handles file upload and returns the uploaded file URL.
   *
   * @param {File} file - File to be uploaded.
   * @returns {Promise<string|null>} - Returns the file URL if successful, otherwise null.
   */
  const handleFileUpload = async (file) => {
    setIsUploading(true);
    const allowedExtensions = ["png", "jpeg", "webp", "jpg"];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      toast.error(
        "Formato de archivo inválido. Solo se permiten PNG, JPEG, WEBP y JPG."
      );
      setIsUploading(false);
      return null;
    }
    const toastId = toast.loading("Cargando archivo...", {
      icon: <Spinner size="sm" />,
      progressStyle: { background: "#113c53" },
    });
    try {
      const { success, fileUrl, error } = await uploadFile(file);
      if (success && fileUrl) {
        toast.update(toastId, {
          render: "Archivo subido con éxito",
          type: "info",
          icon: <img src={check} alt="Ícono de éxito" />,
          progressStyle: { background: "#113c53" },
          isLoading: false,
          autoClose: 3000,
        });
        return fileUrl;
      } else {
        toast.update(toastId, {
          render: error,
          type: "error",
          icon: null,
          progressStyle: {},
          isLoading: false,
          autoClose: 5000,
        });
        return null;
      }
    } catch (error) {
      console.error(error);
      toast.update(toastId, {
        render: "Algo salió mal al cargar el archivo. Intente de nuevo.",
        type: "error",
        icon: null,
        progressStyle: {},
        isLoading: false,
        autoClose: 5000,
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="overflow-auto border border-gray-300 rounded-md">
        <Editor
          apiKey={API_KEY}
          value={value}
          onEditorChange={onChange}
          init={{
            language: "es",
            placeholder,
            branding: false,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "charmap",
              "preview",
              "anchor",
              "pagebreak",
              "wordcount",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "table",
              "emoticons",
              "image",
              "paste",
            ],
            menubar: "file edit view insert format tools table help",
            toolbar:
              "undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist | image",
            file_picker_callback: handleFilePicker,
            paste_preprocess: handlePastePreprocess,
          }}
        />
      </div>
    </div>
  );
}

TextArea.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  setIsUploading: PropTypes.func.isRequired,
};

export default TextArea;
