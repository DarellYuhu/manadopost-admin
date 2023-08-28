import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export default function CustomTable({ data, handleList = () => {} }) {
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
                <TableCell>{item.profile.fullName}</TableCell>
                <TableCell>{item.profile.email}</TableCell>
                <TableCell>{item?.list?.length}</TableCell>
                <TableCell>
                  {
                    item?.list?.filter((news) => news?.reviewed === true)
                      ?.length
                  }
                </TableCell>
                <TableCell sx={{ textAlign: "center" }}>
                  <button
                    className=" flex p-2 rounded-md shadow-md transition ease-in-out duration-300 hover:bg-sky-400"
                    onClick={() => handleList(item)}
                  >
                    <ion-icon name="list-outline"></ion-icon>
                  </button>
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
      <TableCell sx={[titleSx, { width: "10%" }]}>Total News</TableCell>
      <TableCell sx={[titleSx, { width: "10%" }]}>Total Reviewed</TableCell>
      <TableCell sx={[titleSx, { width: "10%" }]}>Action</TableCell>
    </TableRow>
  );
};
