import { database } from "@/config/firebase";
import {
  Modal,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { ref, update } from "firebase/database";

export default function ListModal({ data, open, handleClose = () => {} }) {
  const handleSwitch = async (event, index) => {
    const targetRef = ref(database, `/ads/data/${data.id}/list/${index}`);
    try {
      await update(targetRef, { isAllowed: event.target.checked });
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Modal open={open} onClose={handleClose}>
      <div className="absolute left-1/2 top-1/2 max-h-screen w-[70%] overflow-y-auto transform -translate-x-1/2 -translate-y-1/2 p-4 bg-gray-800 text-white">
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
        <TableContainer>
          <Table>
            <TableHead>
              <TableHeading />
            </TableHead>
            <TableBody>
              {data?.list.map((item, index) => {
                const style = {
                  color: "white",
                };
                return (
                  <TableRow key={index}>
                    <TableCell sx={style}>{index + 1}</TableCell>
                    <TableCell sx={style}>
                      <img
                        src={item.imageUri}
                        alt="ads"
                        className="flex w-full h-20 object-cover rounded-md hover:w-full hover:h-full hover:object-contain"
                      />
                    </TableCell>
                    <TableCell sx={style}>{item.type}</TableCell>
                    <TableCell sx={style}>{item.link}</TableCell>
                    <TableCell sx={style}>{item.startDate}</TableCell>
                    <TableCell sx={style}>{item.endDate}</TableCell>
                    <TableCell sx={style}>
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
        </TableContainer>
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
      <TableCell sx={titleSx}>No</TableCell>
      <TableCell sx={[titleSx, { width: "25%" }]}>Image</TableCell>
      <TableCell sx={titleSx}>Banner Type</TableCell>
      <TableCell sx={titleSx}>Direct Link</TableCell>
      <TableCell sx={titleSx}>Start Date</TableCell>
      <TableCell sx={titleSx}>End Date</TableCell>
      <TableCell sx={[titleSx, { textAlign: "center" }]}>Allowed</TableCell>
    </TableRow>
  );
};
