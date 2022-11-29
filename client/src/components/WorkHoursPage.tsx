import { Delete, Edit } from "@mui/icons-material";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { WorkHour } from "../api/types";
import { updateArray } from "../share/utils";
import { formatDate, formatTime, secToStr } from "./utils";

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

async function markAsDeleted(id: number): Promise<WorkHour> {
  const query = `
    mutation {
      object: updateWorkHour(id: ${id}, isDeleted: true) {
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

type WorkHourRowProps = {
  workHour: WorkHour;
  onDelete: (wh: WorkHour) => Promise<void>;
  onUpdate: (wh: WorkHour) => Promise<void>;
};

function WorkHourRow({ workHour, onDelete, onUpdate }: WorkHourRowProps) {
  const duration = workHour.endTime
    ? (workHour.endTime.getTime() - workHour.startTime.getTime()) / 1000
    : 0;
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
      <TableCell align="center">
        <Button
          onClick={() => {
            onUpdate(workHour);
          }}
        >
          <Edit />
        </Button>
        <Button
          onClick={() => {
            onDelete(workHour);
          }}
        >
          <Delete />
        </Button>
      </TableCell>
    </TableRow>
  );
}

type WorkHoursPageProps = {
  dealId: number;
};

function WorkHoursPage({ dealId }: WorkHoursPageProps): JSX.Element {
  const [workHours, setWorkHours] = useState<WorkHour[]>([]);
  useEffect(() => {
    loadWorkHours(dealId).then(setWorkHours);
  }, []);

  const handleDeleteWorkHour = async (wh: WorkHour): Promise<void> => {
    const ret = await markAsDeleted(wh.id);
    setWorkHours((whs) => updateArray(whs, ret));
  };
  const updateWorkHour = async (wh: WorkHour): Promise<void> => {};
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
                workHour={wh}
                onDelete={handleDeleteWorkHour}
                onUpdate={updateWorkHour}
              />
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default WorkHoursPage;
