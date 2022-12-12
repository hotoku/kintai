import { Delete, Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Paper,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useEffect, useState } from "react";
import { HalfwayDeal, HalfwayWorkHour, WorkHour } from "../api/types";
import { updateArray } from "../share/utils";
import { formatDate, formatTime, secToStr } from "./utils";
import dayjs, { Dayjs } from "dayjs";

async function throwQuery<T>(query: string, name?: string): Promise<T> {
  name = name || "object";
  const ret = await fetch("/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: query,
    }),
  });
  return (await ret.json()).data[name] as T;
}

type WorkHourRecord = Omit<WorkHour, "startTime" | "endTime"> & {
  startTime: string;
  endTime?: string;
};

function rec2obj(obj: WorkHourRecord): WorkHour {
  return {
    ...obj,
    startTime: new Date(obj.startTime),
    endTime: obj.endTime ? new Date(obj.endTime) : undefined,
  };
}

async function loadWorkHours(dealId: number): Promise<WorkHour[]> {
  const query = `
        query {
          object: getWorkHoursOfDeal(dealId: ${dealId}) {
            id
            dealId
            startTime
            endTime
            isDeleted
            note
          }
        }
      `;
  const objs = await throwQuery<WorkHourRecord[]>(query);
  return objs.map(rec2obj);
}

async function updateWorkHour(wh: WorkHour): Promise<WorkHour> {
  const query = `
    mutation {
      object: updateWorkHour(
        id: ${wh.id},
        startTime: "${wh.startTime}",
        endTime: "${wh.endTime ? wh.endTime : "NULL"}",
        isDeleted: ${wh.isDeleted},
        note: "${wh.note}"
      ) {
        id
        startTime
        endTime
        dealId
        isDeleted
        note
      }
    }
  `;
  const obj = await throwQuery<WorkHourRecord>(query);
  return rec2obj(obj);
}

type WorkHourRowProps =
  | {
      workHour: WorkHour;
      deleted: false;
      onDelete: (wh: WorkHour) => Promise<void>;
      onUpdate: (wh: WorkHour) => Promise<void>;
    }
  | {
      workHour: WorkHour;
      deleted: true;
      onRecover: (wh: WorkHour) => Promise<void>;
    };

function WorkHourRow({ workHour, ...props }: WorkHourRowProps) {
  const duration = workHour.endTime
    ? (workHour.endTime.getTime() - workHour.startTime.getTime()) / 1000
    : 0;

  const actions = props.deleted ? (
    <Button
      onClick={() => {
        props.onRecover(workHour);
      }}
    >
      戻す
    </Button>
  ) : (
    <>
      <Button
        onClick={() => {
          props.onUpdate(workHour);
        }}
      >
        <Edit />
      </Button>
      <Button
        onClick={() => {
          props.onDelete(workHour);
        }}
      >
        <Delete />
      </Button>
    </>
  );

  return (
    <TableRow key={workHour.id}>
      <TableCell align="center">{formatDate(workHour.startTime)}</TableCell>
      <TableCell align="center">{formatTime(workHour.startTime)}</TableCell>
      <TableCell align="center">
        {workHour.endTime ? formatTime(workHour.endTime) : ""}
      </TableCell>
      <TableCell align="center">{secToStr(duration)}</TableCell>
      <Tooltip title={workHour.note} placement="left">
        <TableCell align="center">
          {workHour.note ? workHour.note.slice(0, 10) : ""}
        </TableCell>
      </Tooltip>
      <TableCell align="center">{actions}</TableCell>
    </TableRow>
  );
}

type ActiveWorkHourTableProps = {
  workHours: WorkHour[];
  onDelete: (wh: WorkHour) => Promise<void>;
  onUpdate: (wh: WorkHour) => Promise<void>;
};
function ActiveWorkHourTable({
  workHours,
  onDelete,
  onUpdate,
}: ActiveWorkHourTableProps): JSX.Element {
  return (
    <TableContainer component={Paper}>
      <Table style={{ maxWidth: "1000px", margin: "auto" }}>
        <TableHead>
          <TableRow>
            <TableCell align="center">date</TableCell>
            <TableCell align="center">start </TableCell>
            <TableCell align="center">end</TableCell>
            <TableCell align="center">duration</TableCell>
            <TableCell align="center">note</TableCell>
            <TableCell align="center">actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {workHours.map((wh) => {
            return (
              <WorkHourRow
                key={wh.id}
                deleted={false}
                workHour={wh}
                onDelete={onDelete}
                onUpdate={onUpdate}
              />
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

type DeletedWorkHourTableProps = {
  workHours: WorkHour[];
  onRecover: (wh: WorkHour) => Promise<void>;
};
function DeletedWorkHourTable({
  workHours,
  onRecover,
}: DeletedWorkHourTableProps): JSX.Element {
  return (
    <TableContainer component={Paper}>
      <Table style={{ maxWidth: "1000px", margin: "auto" }}>
        <TableHead>
          <TableRow>
            <TableCell align="center">date</TableCell>
            <TableCell align="center">start </TableCell>
            <TableCell align="center">end</TableCell>
            <TableCell align="center">duration</TableCell>
            <TableCell align="center">note</TableCell>
            <TableCell align="center">actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {workHours.map((wh) => {
            return (
              <WorkHourRow
                key={wh.id}
                deleted={true}
                workHour={wh}
                onRecover={onRecover}
              />
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

type WorkHourEditorDialogProps = {
  open: boolean;
  onClose: () => void;
  halfwayWorkHour: HalfwayWorkHour;
};
function WorkHourEditorDialog({
  open,
  onClose,
  halfwayWorkHour,
}: WorkHourEditorDialogProps) {
  const [startTime, setStartTime] = useState<Dayjs | null>(
    halfwayWorkHour.startTime === undefined
      ? null
      : dayjs(halfwayWorkHour.startTime)
  );
  const [endTime, setEndTime] = useState<Dayjs | null>(
    dayjs(halfwayWorkHour.endTime) ?? null
  );
  const [note, setNote] = useState<string>("");
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>ダイアログ</DialogTitle>
      <Box sx={{ padding: "10px" }} component="form">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={3}>
            <DateTimePicker
              onChange={(v: Dayjs | null) => {
                console.log("v =", v);
                setStartTime(v);
              }}
              value={startTime}
              renderInput={(params) => <TextField {...params} />}
              label="start time"
              inputFormat="YYYY-MM-DD HH:mm:ss"
            />
            <DateTimePicker
              onChange={(v: Dayjs | null) => {
                setEndTime(v);
              }}
              value={endTime}
              renderInput={(params) => {
                return <TextField {...params} />;
              }}
              label="end time"
              inputFormat="YYYY-MM-DD HH:mm:ss"
            />
            <TextField
              label="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
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
  const [halfwayWorkHour, setHalfwayWorkHour] = useState<HalfwayWorkHour>({
    dealId: dealId,
  });

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
  const handleUpdateWorkHour = async (wh: WorkHour): Promise<void> => {
    setHalfwayWorkHour({ ...wh });
    setEditedWorkHourId(wh.id);
    setEditorOpen(true);
  };
  return (
    <>
      <FormGroup>
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
      </FormGroup>
      {showDeleted ? (
        <DeletedWorkHourTable
          workHours={workHours.filter((wh) => wh.isDeleted)}
          onRecover={handleRecoverWorkHour}
        />
      ) : (
        <ActiveWorkHourTable
          workHours={workHours.filter((wh) => !wh.isDeleted)}
          onDelete={handleDeleteWorkHour}
          onUpdate={handleUpdateWorkHour}
        />
      )}
      <WorkHourEditorDialog
        open={editorOpen}
        onClose={() => {
          console.log("close");
          setEditorOpen(false);
        }}
        halfwayWorkHour={halfwayWorkHour}
        key={editedWorkHourId}
      ></WorkHourEditorDialog>
    </>
  );
}

export default WorkHoursPage;
