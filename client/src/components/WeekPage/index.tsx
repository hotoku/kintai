import Paper from "@mui/material/Paper";
import { useEffect, useMemo, useState } from "react";
import { DaySummary, loadWeekSummary } from "./utils";
import { Button } from "@mui/material";
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

export type Filter = {
  clientId?: number;
  dealId?: number;
};

function WeekPage({ date: date_ }: WeekPageProps): JSX.Element {
  const [date, setDate] = useState(date_);
  const [allSummaries, setAllSummaries] = useState<DaySummary[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [filter, setFilter] = useState<Filter>({});

  const clients = useMemo(() => {
    const ret = new Map<number, string>();
    for (const s of allSummaries) {
      const whs = s.workHours;
      for (const wh of whs) {
        const client = wh.deal.client;
        if (ret.get(client.id) !== client.name) {
          throw new Error(
            `bad data: client ${client.id} has multiple name. ${ret.get(
              client.id
            )}, ${client.name}`
          );
        }
        ret.set(client.id, client.name);
      }
    }
  }, [allSummaries]);
  const deals = useMemo(() => {
    const ret = new Map<number, string>();
    for (const s of allSummaries) {
      const whs = s.workHours;
      for (const wh of whs) {
        if (
          filter.clientId === undefined ||
          filter.clientId === wh.deal.client.id
        ) {
          const deal = wh.deal;
          if (ret.get(deal.id) !== deal.name) {
            throw new Error(
              `bad data: client ${deal.id} has multiple name. ${ret.get(
                deal.id
              )}, ${deal.name}`
            );
          }
          ret.set(deal.id, deal.name);
        }
      }
    }
    return ret;
  }, [allSummaries, filter.clientId]);
  const deal2client = useMemo(() => {
    const ret = new Map<number, number>();
    for (const s of allSummaries) {
      const whs = s.workHours;
      for (const wh of whs) {
        const deal = wh.deal;
        const client = deal.client;
        if (ret.get(deal.id) !== client.id) {
          throw new Error(
            `bad data: deal ${deal.id}:${deal.name} has multiple client. ${
              client.id
            }:${client.name}, ${ret.get(deal.id)}`
          );
        }
        ret.set(deal.id, client.id);
      }
    }
  }, [allSummaries]);

  useEffect(() => {
    loadWeekSummary(date).then(setAllSummaries);
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
      <Content summaries={allSummaries} filter={filter} />
    </Paper>
  );
}

export default WeekPage;
