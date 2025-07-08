import React from "react";
import Modal from "@/components/ui/Modal";
import DepositMethodForm from "./DepositMethodForm";

const DepositMethodModal = ({ isOpen, onClose, title, initialData = null, onSubmit, isSubmitting }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="lg"
      centered
      footer={
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      }
    >
      <DepositMethodForm initialData={initialData} onSubmit={onSubmit} isSubmitting={isSubmitting} />
    </Modal>
  );
};

export default DepositMethodModal;
