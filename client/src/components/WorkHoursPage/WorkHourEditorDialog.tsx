import { Box, Button, Dialog, Stack, TextField } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useState } from "react";
import { HalfwayWorkHour, WorkHour } from "../../api/types";
import dayjs, { Dayjs } from "dayjs";

type WorkHourEditorDialogProps = {
  open: boolean;
  onSave: (wh: Omit<WorkHour, "id"> & { id?: number }) => Promise<void>;
  onCancel: (hwh: HalfwayWorkHour) => Promise<void>;
  initialObject: HalfwayWorkHour;
};

function WorkHourEditorDialog({
  open,
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
        onCancel(editedObject);
      }}
    >
      <Box sx={{ padding: 1 }} component="form">
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
                  if (editedObject.startTime) {
                    onSave({
                      ...editedObject,
                      startTime: editedObject.startTime,
                    });
                  }
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
