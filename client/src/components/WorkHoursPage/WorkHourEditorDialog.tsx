import { Box, Button, Dialog, Stack, TextField } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useState } from "react";
import { HalfwayWorkHour } from "../../api/types";
import dayjs, { Dayjs } from "dayjs";

type WorkHourEditorDialogProps = {
  open: boolean;
  onClose: (hwh: HalfwayWorkHour) => Promise<void>;
  onSave: (hwh: HalfwayWorkHour) => Promise<void>;
  onCancel: (hwh: HalfwayWorkHour) => Promise<void>;
  initialObject: HalfwayWorkHour;
};

function WorkHourEditorDialog({
  open,
  onClose,
  onSave,
  onCancel,
  initialObject,
}: WorkHourEditorDialogProps) {
  const [editedObject, setEditedObject] = useState<HalfwayWorkHour>({
    ...initialObject,
  });
  const canSave = editedObject.startTime;
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
              <Button
                variant="contained"
                disabled={!canSave}
                onClick={() => {
                  onSave(editedObject);
                }}
              >
                save
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  onCancel(editedObject);
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
