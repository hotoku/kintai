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
import { WorkHourRow } from "./WorkHourRow";

export type ActiveWorkHourTableProps = {
  workHours: WorkHour[];
  onDelete: (wh: WorkHour) => Promise<void>;
  onUpdate: (wh: WorkHour) => Promise<void>;
};
export function ActiveWorkHourTable({
  workHours,
  onDelete,
  onUpdate,
}: ActiveWorkHourTableProps): JSX.Element {
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
                deleted={false}
                workHour={wh}
                onDelete={onDelete}
                onUpdate={onUpdate}
              />
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
