import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import { useEffect, useState } from "react";
import { formatTime, formatDate } from "../../share/utils";
import { secToStr } from "../utils";
import { DaySummary, loadWeekSummary, WorkHour } from "./utils";
import { TableBody, TableContainer, TableRow } from "@mui/material";

function duration(wh: WorkHour): number {
  if (!wh.endTime) return 0;
  return (wh.endTime.getTime() - wh.startTime.getTime()) / 1000;
}

type WeekPageProps = {
  date: string;
};

function RenderWorkHour({ wh }: { wh: WorkHour }): JSX.Element {
  return (
    <TableRow>
      {formatTime(wh.startTime)} - {wh.endTime ? formatTime(wh.endTime) : ""}
      {wh.endTime ? `(${secToStr(duration(wh))})` : ""}
      {wh.note}■{wh.deal.name.substring(0, 20)}
      <br />
    </TableRow>
  );
}

function RenderDaySummary({ ds }: { ds: DaySummary }): JSX.Element {
  const totalDuration = secToStr(
    ds.workHours.map((wh) => duration(wh)).reduce((x, y) => x + y, 0)
  );
  return (
    <Card style={{ margin: "10px", background: "#f7f7f7" }}>
      {formatDate(ds.date)}: 合計 {totalDuration}
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

function WeekPage({ date }: WeekPageProps): JSX.Element {
  const [summaries, setSummaries] = useState<DaySummary[]>([]);
  useEffect(() => {
    loadWeekSummary(date).then(setSummaries);
  }, []);
  return (
    <Paper style={{ margin: "10px auto", display: "table" }}>
      {summaries.map((s) => (
        <RenderDaySummary key={s.date.toISOString()} ds={s} />
      ))}
    </Paper>
  );
}

export default WeekPage;
