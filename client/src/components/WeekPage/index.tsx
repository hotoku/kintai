import Paper from "@mui/material/Paper";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DaySummary, loadWeekSummary } from "./utils";
import { Button } from "@mui/material";
import { ArrowForward, ArrowBack } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Content from "./Content";
import { Deal, HalfwayWorkHour, WorkHour } from "../../api/types";
import { addWorkHour, updateWorkHour } from "../WorkHoursPage/utils";
import WorkHourEditorDialog from "../common/WorkHourEditorDialog";
import DealSelector, { Client, Selection } from "../common/DealSelector2";

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

function searchWorkHour(id: number, ds: DaySummary[]): WorkHour {
  for (const d of ds) {
    for (const wh of d.workHours) {
      if (wh.id === id) {
        return {
          ...wh,
          dealId: wh.deal.id,
        };
      }
    }
  }
  throw new Error(`cannot find work hour of id=${id}`);
}

function WeekPage({ date: date_ }: WeekPageProps): JSX.Element {
  const [date, setDate] = useState(date_);
  const [allSummaries, setAllSummaries] = useState<DaySummary[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [selection, setSelection] = useState<Selection>({
    clientId: "",
    dealId: "",
  });
  const [editedWorkHourId, setEditedWorkHourId] = useState<
    number | "adding" | undefined
  >();
  const [editorDate, setEditorDate] = useState<Date | undefined>();

  const [clients, deals] = useMemo(() => {
    const clients = new Map<number, Client>();
    const deals = new Map<number, Pick<Deal, "id" | "name" | "clientId">>();
    for (const s of allSummaries) {
      for (const w of s.workHours) {
        const deal = w.deal;
        const client = deal.client;
        if (!deals.has(deal.id)) {
          deals.set(deal.id, {
            id: deal.id,
            name: deal.name,
            clientId: deal.client.id,
          });
        }
        if (!clients.has(client.id)) {
          clients.set(client.id, {
            id: client.id,
            name: client.name,
            deals: [],
          });
        }
      }
    }
    deals.forEach((d) => {
      const client = clients.get(d.clientId);
      if (!client) throw new Error("panic");
      client.deals.push(d);
    });
    return [Array.from(clients.values()), deals];
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
  const objForEditor: HalfwayWorkHour = useMemo(
    () =>
      typeof editedWorkHourId === "number"
        ? searchWorkHour(editedWorkHourId, allSummaries)
        : { startTime: editorDate, endTime: editorDate },
    [allSummaries, editedWorkHourId, editorDate]
  );
  const handleAddWorkHour = async (date: Date) => {
    setEditedWorkHourId("adding");
    setEditorDate(date);
  };
  const handleUpdateWorkHour = async (wh: WorkHour) => {
    setEditedWorkHourId(wh.id);
  };
  const handleCancel = async (_: HalfwayWorkHour): Promise<void> => {
    setEditedWorkHourId(undefined);
  };
  const handleSave = useCallback(
    async (wh: Omit<WorkHour, "id"> & { id?: number }): Promise<void> => {
      setEditedWorkHourId(undefined);
      if (!wh.startTime) {
        throw new Error("Start time must be set.");
      }
      if (!wh.dealId) {
        throw new Error("Work hour of no deal id was passed to editor");
      }

      if (typeof editedWorkHourId === "number") {
        if (!wh.id) {
          throw new Error("editing instance of no id");
        }
        await updateWorkHour({
          ...wh,
          id: wh.id,
          startTime: wh.startTime,
        });
      } else if (editedWorkHourId === "adding") {
        await addWorkHour({
          ...wh,
          startTime: wh.startTime,
        });
      }
      const summaries = await loadWeekSummary(date);
      setAllSummaries(summaries);
    },
    [date, editedWorkHourId]
  );

  const dialog = useMemo(() => {
    if (typeof editedWorkHourId === "number") {
      const dealId = objForEditor.dealId;
      if (dealId === undefined) {
        throw new Error("panic");
      }
      const deal = deals.get(dealId);
      if (deal === undefined) {
        throw new Error("panic");
      }
      return (
        <WorkHourEditorDialog
          open={editedWorkHourId !== undefined}
          onSave={handleSave}
          onCancel={handleCancel}
          initialObject={objForEditor}
          type="fixed"
          deal={deal}
          key={editedWorkHourId}
        />
      );
    } else {
      return (
        <WorkHourEditorDialog
          open={editedWorkHourId !== undefined}
          onSave={handleSave}
          onCancel={handleCancel}
          initialObject={objForEditor}
          type="choice"
          key={editedWorkHourId}
        />
      );
    }
  }, [deals, editedWorkHourId, handleSave, objForEditor]);

  return (
    <>
      <Paper style={{ margin: "0 auto", display: "table", padding: "10px" }}>
        <Navigation
          onForwardClick={handleForwardClick}
          onBackClick={handleBackClick}
        />
        <DealSelector
          clients={clients}
          onSelectionChange={async (s) => setSelection(s)}
        />
        <Content
          summaries={allSummaries}
          filter={selection}
          handleAddWorkHour={handleAddWorkHour}
          handleUpdateWorkHour={handleUpdateWorkHour}
        />
      </Paper>
      {dialog}
    </>
  );
}

export default WeekPage;
