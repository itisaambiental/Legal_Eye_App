import PropTypes from "prop-types";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

/**
 * TextArea Component
 *
 * This component renders a rich text editor using ReactQuill.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {string} props.value - The current content of the editor.
 * @param {Function} props.onChange - Callback triggered when the content changes.
 * @param {string} props.placeholder - Placeholder text for the editor.
 *
 * @returns {JSX.Element} The rendered TextArea component.
 */
function TextArea({ value, onChange, placeholder }) {

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["link"],
        ["clean"],
      ]
    },
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "bullet",
    "align",
    "link",
  ];

  return (
    <div
      className="w-full overflow-auto border border-gray-300 rounded-md min-h-[100px] max-h-[300px]"
    >
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
      />
    </div>
  );
}

TextArea.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default TextArea;
