import {
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { formatTime } from "../../share/utils";
import { formatDate, secToStr } from "../utils";
import { DaySummary, WorkHour } from "./utils";
import { WorkHour as WorkHourType } from "../../api/types";
import { Add, Edit } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { Selection } from "../common/DealSelector2";

function duration(wh: WorkHour): number {
  if (!wh.endTime) return 0;
  return (wh.endTime.getTime() - wh.startTime.getTime()) / 1000;
}

function RenderWorkHour({
  wh,
  onUpdate,
}: {
  wh: WorkHour;
  onUpdate: (wh: WorkHourType) => void;
}): JSX.Element {
  return (
    <TableRow>
      <TableCell style={{ minWidth: "6rem" }}>
        {formatTime(wh.startTime)} - {wh.endTime ? formatTime(wh.endTime) : ""}
      </TableCell>
      <TableCell style={{ width: "3rem" }}>
        {wh.endTime ? `${secToStr(duration(wh))}` : "-"}
      </TableCell>
      <TableCell style={{ width: "6rem" }}>{wh.deal.client.name}</TableCell>
      <TableCell style={{ width: "15rem" }}>
        <Link to={`/workHours?dealId=${wh.deal.id}`}>
          {wh.deal.name.substring(0, 20)}
        </Link>
      </TableCell>
      <TableCell style={{ width: "15rem" }}>{wh.note}</TableCell>
      <TableCell>
        <Button
          onClick={() =>
            onUpdate({
              ...wh,
              dealId: wh.deal.id,
            })
          }
        >
          <Edit />
        </Button>
      </TableCell>
    </TableRow>
  );
}

function RenderDaySummary({
  ds,
  filter,
  onAddClick,
  onUpdateClick,
}: {
  ds: DaySummary;
  filter: Selection;
  onAddClick: (date: Date) => void;
  onUpdateClick: (wh: WorkHourType) => void;
}): JSX.Element {
  const workHours = ds.workHours
    .filter((wh) => !wh.isDeleted)
    .filter(
      (wh) =>
        (filter.dealId === "" || wh.deal.id === filter.dealId) &&
        (filter.clientId === "" || wh.deal.client.id === filter.clientId)
    );
  const totalDuration = secToStr(
    workHours.map((wh) => duration(wh)).reduce((x, y) => x + y, 0)
  );
  return (
    <Card
      style={{
        background: "#f7f7f7",
        padding: "5px 5px 0",
      }}
    >
      <Typography component="div" variant="h6">
        {formatDate(ds.date)}: 合計 {totalDuration}
        <Button
          onClick={() => {
            onAddClick(ds.date);
          }}
        >
          <Add />
        </Button>
      </Typography>
      <TableContainer>
        <Table>
          <TableBody>
            {workHours.map((wh) => (
              <RenderWorkHour key={wh.id} wh={wh} onUpdate={onUpdateClick} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}

type ContentProps = {
  summaries: DaySummary[];
  filter: Selection;
  handleAddWorkHour: (date: Date) => Promise<void>;
  handleUpdateWorkHour: (wh: WorkHourType) => Promise<void>;
};
function Content({
  summaries,
  filter,
  handleAddWorkHour,
  handleUpdateWorkHour,
}: ContentProps): JSX.Element {
  return (
    <>
      {summaries.map((s) => (
        <RenderDaySummary
          key={s.date.toISOString()}
          ds={s}
          filter={filter}
          onAddClick={handleAddWorkHour}
          onUpdateClick={handleUpdateWorkHour}
        />
      ))}
    </>
  );
}
export default Content;
