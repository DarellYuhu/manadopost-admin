import { Modal } from "@mui/material";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CustomCalendar({
  open,
  handleClose = () => {},
  onChange = () => {},
}) {
  return (
    <Modal open={open} onClose={handleClose}>
      <div className="bg-slate-800 rounded-xl text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Calendar
          onChange={(value) => {
            onChange(value);
            handleClose();
          }}
          className="text-black"
        />
      </div>
    </Modal>
  );
}
