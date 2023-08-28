import { database } from "@/config/firebase";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { onValue, ref } from "firebase/database";
import { useEffect, useRef, useState } from "react";
import Action from "./action";

export default function CustomTable({ data }) {
  const [lotteryList, setLotteryList] = useState(null);
  // const [selectedRow, setSelectedRow] = useState(null);
  const actionRef = useRef(null);
  const lotteryRef = ref(database, "lottery");

  useEffect(() => {
    onValue(lotteryRef, (snapshot) => {
      setLotteryList(snapshot.val().winner);
    });
  }, []);
  return (
    <TableContainer sx={{ overflowX: "auto" }}>
      <Table>
        <TableHead>
          <TableHeading />
        </TableHead>
        <TableBody>
          {data?.map((item, index) => {
            return (
              <TableRow key={item.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.fullName}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>
                  {lotteryList.find((user) => user.email === item.email)
                    ? "Yes"
                    : "No"}
                </TableCell>
                <TableCell>
                  {lotteryList.find(
                    (user) => user.claimed === true && user.email === item.email
                  )
                    ? "Yes"
                    : "No"}
                </TableCell>
                <TableCell sx={{ textAlign: "center", position: "relative" }}>
                  <Action user={item} lotteryList={lotteryList} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const TableHeading = () => {
  const titleSx = {
    color: "text.secondary",
  };
  return (
    <TableRow>
      <TableCell sx={[titleSx, { width: "1%" }]}>No</TableCell>
      <TableCell sx={[titleSx, { width: "20%" }]}>Full Name</TableCell>
      <TableCell sx={[titleSx, { width: "20%" }]}>Email</TableCell>
      <TableCell sx={[titleSx, { width: "10%" }]}>On Winner List</TableCell>
      <TableCell sx={[titleSx, { width: "10%" }]}>Claimed</TableCell>
      <TableCell sx={[titleSx, { width: "10%", textAlign: "center" }]}>
        Action
      </TableCell>
    </TableRow>
  );
};
