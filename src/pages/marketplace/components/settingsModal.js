import { Modal } from "@mui/material";

export default function SettingsModal({ open, handleClose = () => {} }) {
  return (
    <Modal open={open} onClose={handleClose}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 text-white">
        Yuhu
      </div>
    </Modal>
  );
}
