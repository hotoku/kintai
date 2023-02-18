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
import { Filter } from ".";
import { Add, Update } from "@mui/icons-material";

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
      <TableCell>
        <Button
          onClick={() =>
            onUpdate({
              ...wh,
              dealId: wh.deal.id,
            })
          }
        >
          <Update />
        </Button>
      </TableCell>
      <TableCell style={{ width: "6rem" }}>
        {formatTime(wh.startTime)} - {wh.endTime ? formatTime(wh.endTime) : ""}
      </TableCell>
      <TableCell style={{ width: "3rem" }}>
        {wh.endTime ? `${secToStr(duration(wh))}` : "-"}
      </TableCell>
      <TableCell style={{ width: "15rem" }}>{wh.deal.client.name}</TableCell>
      <TableCell style={{ width: "15rem" }}>
        {wh.deal.name.substring(0, 20)}
      </TableCell>
      <TableCell style={{ width: "15rem" }}>{wh.note}</TableCell>
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
  filter: Filter;
  onAddClick: (date: Date) => void;
  onUpdateClick: (wh: WorkHourType) => void;
}): JSX.Element {
  const totalDuration = secToStr(
    ds.workHours.map((wh) => duration(wh)).reduce((x, y) => x + y, 0)
  );
  return (
    <Card
      style={{
        margin: "10px",
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
            {ds.workHours
              .filter((wh) => !wh.isDeleted)
              .filter((wh) => {
                return (
                  (filter.dealId === "" || wh.deal.id === filter.dealId) &&
                  (filter.clientId === "" ||
                    wh.deal.client.id === filter.clientId)
                );
              })
              .map((wh) => (
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
  filter: Filter;
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
