import {
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
import { Filter } from ".";

function duration(wh: WorkHour): number {
  if (!wh.endTime) return 0;
  return (wh.endTime.getTime() - wh.startTime.getTime()) / 1000;
}

function RenderWorkHour({ wh }: { wh: WorkHour }): JSX.Element {
  return (
    <TableRow>
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

function RenderDaySummary({ ds }: { ds: DaySummary }): JSX.Element {
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
      </Typography>
      <TableContainer>
        <Table>
          <TableBody>
            {ds.workHours
              .filter((wh) => !wh.isDeleted)
              .map((wh) => (
                <RenderWorkHour key={wh.id} wh={wh} />
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
};
function Content({ summaries }: ContentProps): JSX.Element {
  return (
    <>
      {summaries.map((s) => (
        <RenderDaySummary key={s.date.toISOString()} ds={s} />
      ))}
    </>
  );
}
export default Content;
