import Paper from "@mui/material/Paper";
import { useEffect, useMemo, useState } from "react";
import { DaySummary, loadWeekSummary } from "./utils";
import { Button, MenuItem, Select, SelectChangeEvent } from "@mui/material";
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
  clientId: number | "";
  dealId: number | "";
};

function id2name<K, V>(objs: { id: K; name: V }[]): Map<K, V> {
  const ret = new Map<K, V>();
  for (const { id, name } of objs) {
    if (ret.get(id) && ret.get(id) !== name) {
      throw new Error(
        `bad data ${id} has multiple name. ${ret.get(id)}, ${name}`
      );
    }
    ret.set(id, name);
  }
  return ret;
}

type ClientMap = Map<number, string>;
type DealMap = Map<number, string>;

type FilterSelectProps = {
  clients: ClientMap;
  deals: DealMap;
  onClientChange: (id: number | "") => void;
  onDealChange: (id: number | "") => void;
};

function menuItem(map: Map<number, string>): JSX.Element[] {
  const ret = [] as JSX.Element[];
  ret.push(
    <MenuItem key={"none"} value="">
      <em>All</em>
    </MenuItem>
  );
  map.forEach((name, id) => {
    ret.push(
      <MenuItem key={id} value={id}>
        {name}
      </MenuItem>
    );
  });
  return ret;
}

function maybeInt(s: string): number | "" {
  const ret = parseInt(s);
  return Number.isNaN(ret) ? "" : ret;
}

function FilterSelect({
  clients,
  deals,
  onClientChange,
  onDealChange,
}: FilterSelectProps): JSX.Element {
  const [clientId, setClientId] = useState<number | "">("");
  const [dealId, setDealId] = useState<number | "">("");

  const handleStateChange = (
    handlers: ((id: number | "") => void)[]
  ): ((e: SelectChangeEvent<number>) => void) => {
    return (e: SelectChangeEvent<number>) => {
      for (const h of handlers) {
        const v = e.target.value;
        const id = typeof v === "string" ? maybeInt(v) : v;
        h(id);
      }
    };
  };

  const clearDealId = () => {
    setDealId("");
    onDealChange("");
  };

  return (
    <>
      <Select
        onChange={handleStateChange([onClientChange, setClientId, clearDealId])}
        value={clientId}
      >
        {menuItem(clients)}
      </Select>
      <Select
        onChange={handleStateChange([onDealChange, setDealId])}
        value={dealId}
      >
        {menuItem(deals)}
      </Select>
    </>
  );
}

function WeekPage({ date: date_ }: WeekPageProps): JSX.Element {
  const [date, setDate] = useState(date_);
  const [allSummaries, setAllSummaries] = useState<DaySummary[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [filter, setFilter] = useState<Filter>({ clientId: "", dealId: "" });

  const clients = useMemo(() => {
    const clients = allSummaries
      .map((s) => s.workHours.map((wh) => wh.deal.client))
      .reduce((x, y) => x.concat(y), []);
    return id2name(clients);
  }, [allSummaries]);
  const deals = useMemo(() => {
    const deals = allSummaries
      .map((s) => s.workHours.map((wh) => wh.deal))
      .reduce((x, y) => x.concat(y), [])
      .filter((d) => filter.clientId === "" || filter.clientId === d.client.id);
    return id2name(deals);
  }, [allSummaries, filter.clientId]);

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
  const handleAddWorkHour = async (date: Date) => {};

  const handleClientSelect = (id: number | "") => {
    setFilter((f) => {
      return { ...f, clientId: id };
    });
  };
  const handleDealSelect = (id: number | "") => {
    setFilter((f) => {
      return { ...f, dealId: id };
    });
  };

  return (
    <Paper style={{ margin: "0 auto", display: "table" }}>
      <Navigation
        onForwardClick={handleForwardClick}
        onBackClick={handleBackClick}
      />
      <FilterSelect
        clients={clients}
        deals={deals}
        onClientChange={handleClientSelect}
        onDealChange={handleDealSelect}
      ></FilterSelect>
      <Content
        summaries={allSummaries}
        filter={filter}
        handleAddWorkHour={handleAddWorkHour}
      />
    </Paper>
  );
}

export default WeekPage;
