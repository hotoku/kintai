import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import { useEffect, useState } from "react";
import { formatTime, formatDate } from "../../share/utils";
import { secToStr } from "../utils";
import { DaySummary, loadWeekSummary, WorkHour } from "./utils";
import {
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { ArrowForward, ArrowBack } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

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
    <Card style={{ margin: "10px", background: "#f7f7f7" }}>
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

type NavigationProps = {
  onBackClick: () => Promise<void>;
  onForwardClick: () => Promise<void>;
};

function Navigation({
  onBackClick,
  onForwardClick,
}: NavigationProps): JSX.Element {
  return (
    <div>
      <ArrowBack onClick={onBackClick} />
      <ArrowForward onClick={onForwardClick} />
    </div>
  );
}

function WeekPage({ date: date_ }: WeekPageProps): JSX.Element {
  const [date, setDate] = useState(date_);
  const [summaries, setSummaries] = useState<DaySummary[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadWeekSummary(date).then(setSummaries);
  }, [date]);
  const navigateToAnotherWeek = async (n: number) => {
    const d1 = dayjs(date);
    const d2 = d1.add(n * 7, "day");
    const date2 = d2.format("YYYY-MM-DD");
    const url = location.pathname + `?week=${date2}`;
    setDate(date2);
    navigate(url);
  };
  const handleForwardClick = async () => {
    navigateToAnotherWeek(1);
  };
  const handleBackClick = async () => {
    navigateToAnotherWeek(-1);
  };

  return (
    <Paper style={{ margin: "10px auto", display: "table" }}>
      <Navigation
        onForwardClick={handleForwardClick}
        onBackClick={handleBackClick}
      />
      {summaries.map((s) => (
        <RenderDaySummary key={s.date.toISOString()} ds={s} />
      ))}
    </Paper>
  );
}

export default WeekPage;
