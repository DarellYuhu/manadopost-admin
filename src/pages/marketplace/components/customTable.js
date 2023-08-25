import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

export default function CustomTable({ data, actionPressed = () => {} }) {
  return (
    <Table>
      <TableHead>
        <TableHeading />
      </TableHead>
      <TableBody>
        {data?.map((item, index) => {
          return (
            <TableItem
              item={item}
              key={index}
              actionPressed={actionPressed}
              index={index}
            />
          );
        })}
      </TableBody>
    </Table>
  );
}

const TableHeading = () => {
  const titleSx = {
    color: "text.secondary",
  };
  return (
    <TableRow sx={{ backgroundColor: "background.grey" }}>
      <TableCell sx={[titleSx, { width: "20%" }]}>Full Name</TableCell>
      <TableCell sx={[titleSx, { width: "25%" }]}>Email</TableCell>
      <TableCell sx={titleSx}>Total Ads</TableCell>
      <TableCell sx={titleSx}>Total Allowed</TableCell>
      <TableCell sx={[titleSx, { textAlign: "center" }]}>Actions</TableCell>
    </TableRow>
  );
};

const TableItem = ({ item, index, actionPressed = () => {} }) => {
  console.log(item);
  return (
    <TableRow key={item.id}>
      <TableCell>{item.profile.fullName}</TableCell>
      <TableCell>{item.profile.email}</TableCell>
      <TableCell>{item.list.length}</TableCell>
      <TableCell>
        {item.list.filter((item) => item.isAllowed === true).length}
      </TableCell>
      <TableCell className="relative">
        <button
          className="text-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          onClick={() => actionPressed({ ...item, index })}
        >
          <ion-icon name="ellipsis-vertical-circle-outline"></ion-icon>
        </button>
      </TableCell>
    </TableRow>
  );
};
