import { Delete, Edit } from "@mui/icons-material";
import { Button, TableCell, TableRow, Tooltip } from "@mui/material";
import { WorkHour } from "../../api/types";
import { formatDate, secToStr } from "../utils";
import { formatTime } from "../../share/utils";

type WorkHourRowProps =
  | {
      workHour: WorkHour;
      deleted: false;
      onDelete: (wh: WorkHour) => Promise<void>;
      onUpdate: (wh: WorkHour) => Promise<void>;
    }
  | {
      workHour: WorkHour;
      deleted: true;
      onRecover: (wh: WorkHour) => Promise<void>;
    };

function WorkHourRow({ workHour, ...props }: WorkHourRowProps) {
  const duration = workHour.endTime
    ? (workHour.endTime.getTime() - workHour.startTime.getTime()) / 1000
    : 0;

  const actions = props.deleted ? (
    <Button
      onClick={() => {
        props.onRecover(workHour);
      }}
    >
      戻す
    </Button>
  ) : (
    <>
      <Button
        onClick={() => {
          props.onUpdate(workHour);
        }}
      >
        <Edit />
      </Button>
      <Button
        onClick={() => {
          props.onDelete(workHour);
        }}
      >
        <Delete />
      </Button>
    </>
  );

  return (
    <TableRow key={workHour.id}>
      <TableCell align="center">{formatDate(workHour.startTime)}</TableCell>
      <TableCell align="center">{formatTime(workHour.startTime)}</TableCell>
      <TableCell align="center">
        {workHour.endTime !== null && workHour.endTime !== undefined
          ? formatTime(workHour.endTime)
          : ""}
      </TableCell>
      <TableCell align="center">{secToStr(duration)}</TableCell>
      <Tooltip title={workHour.note} placement="left">
        <TableCell
          style={{
            maxWidth: "8rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {workHour.note ? workHour.note : ""}
        </TableCell>
      </Tooltip>
      <TableCell align="center">{actions}</TableCell>
    </TableRow>
  );
}

export default WorkHourRow;
