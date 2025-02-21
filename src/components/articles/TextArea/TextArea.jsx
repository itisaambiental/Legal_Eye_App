import PropTypes from "prop-types";
import { Editor } from '@tinymce/tinymce-react';

const API_KEY = import.meta.env.VITE_TINYMCE;

/**
 * TextArea Component
 *
 * This component renders a rich text editor using TinyMCE.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {string} props.value - The current content of the editor.
 * @param {Function} props.onChange - Callback triggered when the content changes.
 * @param {string} props.placeholder - Placeholder text for the editor.
 *
 * @returns {JSX.Element} The rendered TextArea component.
 */
function TextArea({ value, onChange, placeholder }) {
  return (
    <div className="w-full">
      <div className="overflow-auto border border-gray-300 rounded-md">
        <Editor
          apiKey={API_KEY}
          value={value}
          onEditorChange={onChange}
          init={{
            language: 'es',
            placeholder: placeholder,
            branding: false,
            plugins: [
              'advlist',       // Advanced lists
              'autolink',      // Automatically converts URLs to links
              'lists',         // Lists
              'charmap',       // Insert special characters
              'preview',       // Preview
              'anchor',        // Anchors
              'pagebreak',     // Page breaks
              'wordcount',     // Word count
              'visualblocks',  // Visual blocks
              'code',          // Code view
              'fullscreen',    // Fullscreen
              'insertdatetime',// Insert date/time
              'table',         // Table management
              'emoticons',     // Insert emoticons
            ],
            menubar: 'file edit view insert format tools table help',
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
};

export default TextArea;
