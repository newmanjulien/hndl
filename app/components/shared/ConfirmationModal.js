// app/components/shared/ConfirmationModal.js
"use client";

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>{children}</ModalBody>
      <ModalFooter>
        <Button onClick={onClose} variant="secondary">
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="primary">
          Confirm
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmationModal;
