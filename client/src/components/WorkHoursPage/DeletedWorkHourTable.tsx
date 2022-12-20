import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { WorkHour } from "../../api/types";
import WorkHourRow from "./WorkHourRow";

type DeletedWorkHourTableProps = {
  workHours: WorkHour[];
  onRecover: (wh: WorkHour) => Promise<void>;
};
function DeletedWorkHourTable({
  workHours,
  onRecover,
}: DeletedWorkHourTableProps): JSX.Element {
  return (
    <TableContainer component={Paper}>
      <Table style={{ maxWidth: "1000px", margin: "auto" }}>
        <TableHead>
          <TableRow>
            <TableCell align="center">date</TableCell>
            <TableCell align="center">start </TableCell>
            <TableCell align="center">end</TableCell>
            <TableCell align="center">duration</TableCell>
            <TableCell align="center">note</TableCell>
            <TableCell align="center">actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {workHours.map((wh) => {
            return (
              <WorkHourRow
                key={wh.id}
                deleted={true}
                workHour={wh}
                onRecover={onRecover}
              />
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default DeletedWorkHourTable;
