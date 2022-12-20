import { Box, Button, Dialog, Stack, TextField } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useState } from "react";
import { HalfwayWorkHour, WorkHour } from "../../api/types";
import dayjs, { Dayjs } from "dayjs";

export type WorkHourEditorDialogProps = {
  open: boolean;
  onClose: (hwh: HalfwayWorkHour) => Promise<void>;
  initialObject: HalfwayWorkHour;
};

export function WorkHourEditorDialog({
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
