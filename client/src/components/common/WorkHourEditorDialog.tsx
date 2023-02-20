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
import { useEffect, useState } from "react";
import { Deal, HalfwayWorkHour, WorkHour } from "../../api/types";
import dayjs, { Dayjs } from "dayjs";
import DealSelector from "./DealSelector";
import { ClientMap, DealMap } from "./DealSelector";

type DealSelector2Props = { onDealChange: (id: number | "") => Promise<void> };

function DealSelector2({ onDealChange }: DealSelector2Props): JSX.Element {
  const [clients, setClients] = useState<{ id: number; name: string }[]>([]);
  const [deals, setDeals] = useState<
    { id: number; name: string; client: { id: number } }[]
  >([]);
  const [clientId, setClientId] = useState<number | "">("");
  const [dealId, setDealId] = useState<number | "">("");

  useEffect(() => {}, []);

  const filteredDeals =
    clientId === "" ? deals : deals.filter((d) => d.client.id === clientId);
  const clients2: ClientMap = new Map<number, string>();
  const deals2: DealMap = new Map<number, string>();
  for (const c of clients) {
    clients2.set(c.id, c.name);
  }
  for (const d of deals) {
    deals2.set(d.id, d.name);
  }
  return (
    <DealSelector
      clients={clients2}
      deals={deals2}
      onClientChange={async () => {}}
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
