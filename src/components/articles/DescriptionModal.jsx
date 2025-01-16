import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ScrollShadow,
  Divider
} from "@nextui-org/react";
import PropTypes from "prop-types";

/**
 * DescriptionModal Component
 *
 * This component renders a modal to display the description of an article.
 * It receives the modal state (open/close), title, and description as props.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {boolean} props.isOpen - Determines if the modal is open.
 * @param {Function} props.onClose - Callback to close the modal.
 * @param {string} props.title - The title of the modal.
 * @param {string} props.description - The description content to display in the modal.
 *
 * @returns {JSX.Element} The rendered DescriptionModal component.
 */
function DescriptionModal({ isOpen, onClose, title, description }) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 font-semibold">
             {title}
            </ModalHeader>
            <Divider />
            <ModalBody>
              <ScrollShadow
                hideScrollBar
                orientation="vertical"
                className="max-h-[500px]"
              >
                <p className="text-gray-800 font-light">{description}</p>
              </ScrollShadow>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" variant="solid" onPress={onClose}>
                Cerrar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

DescriptionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default DescriptionModal;
