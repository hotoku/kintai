import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import { useEffect, useState } from "react";
import { formatTime, formatDate } from "../../share/utils";
import { secToStr } from "../utils";
import { DaySummary, loadWeekSummary, WorkHour } from "./utils";
import {
  Button,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { ArrowForward, ArrowBack } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Content from "./Content";

type WeekPageProps = {
  date: string;
};

type NavigationProps = {
  onBackClick: () => Promise<void>;
  onForwardClick: () => Promise<void>;
};

function Navigation({
  onBackClick,
  onForwardClick,
}: NavigationProps): JSX.Element {
  return (
    <div style={{ margin: "0 auto", display: "table" }}>
      <Button onClick={onBackClick}>
        <ArrowBack />
      </Button>
      <Button onClick={onForwardClick}>
        <ArrowForward />
      </Button>
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
    <Paper style={{ margin: "0 auto", display: "table" }}>
      <Navigation
        onForwardClick={handleForwardClick}
        onBackClick={handleBackClick}
      />
      <Content summaries={summaries} />
    </Paper>
  );
}

export default WeekPage;
