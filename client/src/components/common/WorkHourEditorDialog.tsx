import {
  Box,
  Button,
  Dialog,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useCallback, useEffect, useState } from "react";
import { Client, Deal, HalfwayWorkHour, WorkHour } from "../../api/types";
import dayjs, { Dayjs } from "dayjs";
import DealSelector from "./DealSelector";
import { ClientMap, DealMap } from "./DealSelector";
import { throwQuery } from "../utils";

type DealSelector2Props = { onDealChange: (id: number | "") => Promise<void> };

type SelectorState =
  | {
      type: "both";
      clientId: number;
      dealId: number;
    }
  | {
      type: "client";
      clientId: number;
      dealId: "";
    }
  | {
      type: "none";
      clientId: "";
      dealId: "";
    };

function DealSelector2({ onDealChange }: DealSelector2Props): JSX.Element {
  const [allClients, setAllClients] = useState<
    (Client & { deals: Pick<Deal, "id" | "name">[] })[]
  >([]);

  const [selectorState, setSelectorState] = useState<SelectorState>({
    type: "none",
    clientId: "",
    dealId: "",
  });

  const clients: ClientMap = new Map<number, string>();
  for (const c of allClients) {
    clients.set(c.id, c.name);
  }
  const deals: DealMap = new Map<number, string>();

  switch (selectorState.type) {
    case "both":
    case "client":
      for (const c of allClients) {
        if (c.id !== selectorState.clientId) continue;
        for (const d of c.deals) {
          deals.set(d.id, d.name);
        }
      }
      break;
    case "none":
      for (const c of allClients) {
        for (const d of c.deals) {
          deals.set(d.id, d.name);
        }
      }
      break;
  }

  useEffect(() => {
    throwQuery<
      (Client & {
        deals: (Pick<Deal, "id" | "name"> & { client: { id: number } })[];
      })[]
    >(
      `
      {
        object: getAllClients {
          id
          name
          deals {
            id
            name
            client {
              id
            }
          }
        }
      }
    `
    ).then(([data, errs]) => {
      if (errs) {
        throw new Error(JSON.stringify(errs));
      }
      setAllClients(data);
    });
  }, []);

  const handleClientChange = useCallback(
    async (id: number | "") => {
      switch (selectorState.type) {
        case "both":
          if (typeof id === "number") {
            setSelectorState({
              type: "client",
              clientId: id,
              dealId: "",
            });
          } else {
            setSelectorState({
              type: "none",
              clientId: "",
              dealId: "",
            });
          }
          break;
        case "client":
          if (typeof id === "number") {
            setSelectorState({
              type: "client",
              clientId: id,
              dealId: "",
            });
          } else {
            setSelectorState({
              type: "none",
              clientId: "",
              dealId: "",
            });
          }
          break;
        case "none":
          if (typeof id === "number") {
            setSelectorState({
              type: "client",
              clientId: id,
              dealId: "",
            });
          } else {
            setSelectorState({
              type: "none",
              clientId: "",
              dealId: "",
            });
          }
          break;
        default:
          throw new Error("panic");
      }
    },
    [selectorState.type]
  );

  return (
    <DealSelector
      clients={clients}
      deals={deals}
      onClientChange={handleClientChange}
      onDealChange={async () => {}}
    />
  );
}

type WorkHourEditorDialogProps = {
  open: boolean;
  onSave: (wh: Omit<WorkHour, "id"> & { id?: number }) => Promise<void>;
  onCancel: (hwh: HalfwayWorkHour) => Promise<void>;
  initialObject: HalfwayWorkHour;
} & (
  | {
      type: "fixed";
      deal: Pick<Deal, "id" | "name">;
    }
  | {
      type: "choice";
    }
);

function WorkHourEditorDialog(props: WorkHourEditorDialogProps) {
  const [editedObject, setEditedObject] = useState<HalfwayWorkHour>({
    ...props.initialObject,
  });
  const canSave = editedObject.startTime;
  const handleDealChange = async (id: number | "") => {};

  return (
    <Dialog
      open={props.open}
      onClose={() => {
        props.onCancel(editedObject);
      }}
    >
      <Box sx={{ padding: 1 }} component="form">
        {props.type === "fixed" ? (
          <Typography>{props.deal.name}</Typography>
        ) : (
          <DealSelector2 onDealChange={handleDealChange} />
        )}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={1}>
            <Box>
              <DateTimePicker
                onChange={(v: Dayjs | null) => {
                  setEditedObject({
                    ...editedObject,
                    startTime: v ? v.toDate() : undefined,
                  });
                }}
                value={
                  editedObject.startTime ? dayjs(editedObject.startTime) : null
                }
                renderInput={(params) => <TextField {...params} />}
                label="start time"
                inputFormat="YYYY-MM-DD HH:mm:ss"
                ampm={false}
                ampmInClock={false}
              />
              <Button
                sx={{ height: "100%", marginLeft: 0.2 }}
                onClick={() => {
                  const now = dayjs().toDate();
                  setEditedObject({
                    ...editedObject,
                    startTime: now,
                  });
                }}
                variant="outlined"
              >
                now
              </Button>
            </Box>
            <Box>
              <DateTimePicker
                onChange={(v: Dayjs | null) => {
                  setEditedObject({
                    ...editedObject,
                    endTime: v ? v.toDate() : undefined,
                  });
                }}
                value={
                  editedObject.endTime ? dayjs(editedObject.endTime) : null
                }
                renderInput={(params) => <TextField {...params} />}
                label="end time"
                inputFormat="YYYY-MM-DD HH:mm:ss"
                ampm={false}
                ampmInClock={false}
              />
              <Button
                sx={{ height: "100%", marginLeft: 0.2 }}
                onClick={() => {
                  const now = dayjs().toDate();
                  setEditedObject({
                    ...editedObject,
                    endTime: now,
                  });
                }}
                variant="outlined"
              >
                now
              </Button>
            </Box>
            <TextField
              label="note"
              value={editedObject.note ?? ""}
              onChange={(e) =>
                setEditedObject({
                  ...editedObject,
                  note: e.target.value,
                })
              }
            />
            <Box sx={{ "& > :not(style)": { marginRight: 1 } }}>
              <Button
                variant="contained"
                disabled={!canSave}
                onClick={() => {
                  if (typeof editedObject.startTime === "undefined") return;
                  if (typeof editedObject.dealId === "undefined") return;
                  props.onSave({
                    ...editedObject,
                    startTime: editedObject.startTime,
                    dealId: editedObject.dealId,
                  });
                }}
              >
                save
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  props.onCancel(editedObject);
                }}
              >
                cancel
              </Button>
            </Box>
          </Stack>
        </LocalizationProvider>
      </Box>
    </Dialog>
  );
}

export default WorkHourEditorDialog;
