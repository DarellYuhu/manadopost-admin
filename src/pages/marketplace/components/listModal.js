import { database } from "@/config/firebase";
import {
  Modal,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { ref, update } from "firebase/database";

export default function ListModal({ open, handleClose = () => {}, data }) {
  const handleSwitch = async (event, index) => {
    const targetRef = ref(
      database,
      `/marketplace/data/${data.id}/list/${index}`
    );
    try {
      await update(targetRef, { isAllowed: event.target.checked });
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Modal open={open} onClose={handleClose}>
      <div className="bg-slate-800 p-3 max-h-screen overflow-y-auto rounded-xl w-[80%] text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-medium">
            Ads list Request by: {data?.profile.fullName}
          </h1>
          <button
            className="flex flex-row items-center text-2xl bg-red-500 rounded-md p-1"
            onClick={handleClose}
          >
            <ion-icon name="close-circle-outline"></ion-icon>
          </button>
        </div>

        <Table>
          <TableHead>
            <TableHeading />
          </TableHead>
          <TableBody>
            {data?.list.map((item, index) => {
              console.log(item);
              const style = {
                color: "white",
                p: 1,
              };
              return (
                <TableRow key={index}>
                  <TableCell sx={style}>{index + 1}</TableCell>
                  <TableCell sx={style}>
                    <img
                      src={item.adsImage}
                      className="w-28 h-28 object-cover"
                    />
                  </TableCell>
                  <TableCell sx={style}>{item.adsName}</TableCell>
                  <TableCell sx={style}>
                    {item.totalPrice.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    })}
                  </TableCell>
                  <TableCell sx={style}>{item.startDate}</TableCell>
                  <TableCell sx={style}>{item.endDate}</TableCell>
                  <TableCell sx={[style, { textAlign: "center" }]}>
                    <Switch
                      checked={item.isAllowed}
                      onChange={(e) => handleSwitch(e, index)}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Modal>
  );
}

const TableHeading = () => {
  const titleSx = {
    color: "white",
  };
  return (
    <TableRow sx={{ backgroundColor: "background.grey" }}>
      <TableCell sx={[titleSx, { width: "5%" }]}>No</TableCell>
      <TableCell sx={[titleSx, { width: "20%" }]}>Image</TableCell>
      <TableCell sx={titleSx}>Ads Name</TableCell>
      <TableCell sx={titleSx}>Payment Price</TableCell>
      <TableCell sx={titleSx}>Start Date</TableCell>
      <TableCell sx={titleSx}>End Date</TableCell>
      <TableCell sx={[titleSx, { textAlign: "center" }]}>Allowed</TableCell>
    </TableRow>
  );
};
