import {
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import DetailModal from "./detailModal";
import { useState } from "react";

export default function ListModal({
  open = Boolean,
  data,
  handleClose = () => {},
}) {
  const [detailData, setDetailData] = useState(null);
  return (
    <Modal open={open} onClose={handleClose}>
      <div className="bg-slate-800 p-3 max-h-screen overflow-y-auto rounded-xl w-[80%] text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-medium">
            News list by: {data?.profile?.fullName}
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
              const style = {
                color: "white",
                p: 1,
              };
              return (
                <TableRow key={index}>
                  <TableCell sx={style}>{index + 1}</TableCell>
                  <TableCell sx={style}>{item.title}</TableCell>
                  <TableCell sx={style}>
                    <img src={item.image} className="w-28 h-28 object-cover" />
                  </TableCell>
                  <TableCell sx={style}>{item.content}</TableCell>
                  <TableCell sx={style}>{item.section}</TableCell>
                  <TableCell sx={style}>
                    {item.reviewed ? "Yes" : "No"}
                  </TableCell>
                  <TableCell sx={[style, { textAlign: "center" }]}>
                    <button
                      className="flex flex-row items-center py-2 px-1 rounded-md border border-sky-500 transition ease-in-out hover:bg-sky-500 duration-300"
                      onClick={() =>
                        setDetailData({ ...item, index, uid: data.profile.uid })
                      }
                    >
                      <p>Review News</p>
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {detailData && (
          <DetailModal
            open={detailData}
            handleClose={() => setDetailData(null)}
            data={detailData}
          />
        )}
      </div>
    </Modal>
  );
}

const TableHeading = () => {
  const titleSx = {
    color: "white",
    width: "10%",
  };
  return (
    <TableRow sx={{ backgroundColor: "background.grey" }}>
      <TableCell sx={[titleSx, { width: "5%" }]}>No</TableCell>
      <TableCell sx={titleSx}>Title</TableCell>
      <TableCell sx={titleSx}>Image</TableCell>
      <TableCell sx={titleSx}>Content</TableCell>
      <TableCell sx={titleSx}>Tag</TableCell>
      <TableCell sx={titleSx}>Reviewed</TableCell>
      <TableCell sx={titleSx}>Detail</TableCell>
    </TableRow>
  );
};
