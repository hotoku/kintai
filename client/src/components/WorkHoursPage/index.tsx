import {
  Box,
  Button,
  Dialog,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useEffect, useState } from "react";
import { HalfwayWorkHour, WorkHour } from "../../api/types";
import { updateArray } from "../../share/utils";
import { addWorkHour, loadWorkHours, updateWorkHour } from "./utils";
import dayjs, { Dayjs } from "dayjs";
import DeletedWorkHourTable from "./DeletedWorkHourTable";
import ActiveWorkHourTable from "./ActiveWorkHourTable";

type WorkHourEditorDialogProps = {
  open: boolean;
  onClose: (hwh: HalfwayWorkHour) => Promise<void>;
  initialObject: HalfwayWorkHour;
};
function WorkHourEditorDialog({
  open,
  onClose,
  initialObject,
}: WorkHourEditorDialogProps) {
  const [editedObject, setEditedObject] = useState<HalfwayWorkHour>({
    ...initialObject,
  });
  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose(editedObject);
      }}
    >
      <Box sx={{ padding: 1 }} component="form">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={1}>
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
            />
            <DateTimePicker
              onChange={(v: Dayjs | null) => {
                setEditedObject({
                  ...editedObject,
                  endTime: v ? v.toDate() : undefined,
                });
              }}
              value={editedObject.endTime ? dayjs(editedObject.endTime) : null}
              renderInput={(params) => <TextField {...params} />}
              label="end time"
              inputFormat="YYYY-MM-DD HH:mm:ss"
            />
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
              <Button variant="contained">save</Button>
              <Button variant="outlined">cancel</Button>
            </Box>
          </Stack>
        </LocalizationProvider>
      </Box>
    </Dialog>
  );
}

type WorkHoursPageProps = {
  dealId: number;
};
function WorkHoursPage({ dealId }: WorkHoursPageProps): JSX.Element {
  const [workHours, setWorkHours] = useState<WorkHour[]>([]);
  const [showDeleted, setShowDeleted] = useState<boolean>(false);
  const [editorOpen, setEditorOpen] = useState<boolean>(false);

  const [editedWorkHourId, setEditedWorkHourId] = useState<
    number | "adding" | undefined
  >(undefined);

  useEffect(() => {
    loadWorkHours(dealId).then(setWorkHours);
  }, []);

  const handleDeleteWorkHour = async (wh: WorkHour): Promise<void> => {
    const ret = await updateWorkHour({ ...wh, isDeleted: true });
    setWorkHours((whs) => updateArray(whs, ret));
  };
  const handleRecoverWorkHour = async (wh: WorkHour): Promise<void> => {
    const ret = await updateWorkHour({ ...wh, isDeleted: false });
    setWorkHours((whs) => updateArray(whs, ret));
  };
  const handleUpdateClick = async (wh: WorkHour): Promise<void> => {
    setEditedWorkHourId(wh.id);
    setEditorOpen(true);
  };
  const hanldeEditorClose = async (hwh: HalfwayWorkHour): Promise<void> => {
    setEditorOpen(false);
    if (!hwh.startTime) {
      console.log("start time must not be null");
      return;
    }
    if (!hwh.dealId)
      throw new Error("work hour of no deal id was passed to editor");
    if (typeof editedWorkHourId === "number") {
      if (!hwh.id) throw new Error("editing instance of no id");
      const ret = await updateWorkHour({
        ...hwh,
        id: hwh.id,
        startTime: hwh.startTime,
      });
      setWorkHours((whs) => updateArray(whs, ret));
    } else if (editedWorkHourId === "adding") {
      const ret = await addWorkHour({
        ...hwh,
        startTime: hwh.startTime,
      });
      setWorkHours((whs) => [...whs, ret]);
    }
  };
  const handleAddClick = () => {
    setEditedWorkHourId("adding");
    setEditorOpen(true);
  };
  const objForEditor =
    typeof editedWorkHourId === "number"
      ? workHours.find((x) => x.id === editedWorkHourId)
      : { dealId: dealId };
  if (objForEditor === undefined) {
    throw new Error("invalid edit number is set");
  }
  return (
    <>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <Button variant="outlined" onClick={handleAddClick}>
          add
        </Button>
        <FormControlLabel
          label="show deleted"
          control={
            <Switch
              checked={showDeleted}
              onChange={() => {
                setShowDeleted((x) => !x);
              }}
            />
          }
        />
      </Box>
      {showDeleted ? (
        <DeletedWorkHourTable
          workHours={workHours.filter((wh) => wh.isDeleted)}
          onRecover={handleRecoverWorkHour}
        />
      ) : (
        <ActiveWorkHourTable
          workHours={workHours.filter((wh) => !wh.isDeleted)}
          onDelete={handleDeleteWorkHour}
          onUpdate={handleUpdateClick}
        />
      )}
      <WorkHourEditorDialog
        open={editorOpen}
        onClose={hanldeEditorClose}
        initialObject={objForEditor}
        key={editedWorkHourId}
      ></WorkHourEditorDialog>
    </>
  );
}

export default WorkHoursPage;
