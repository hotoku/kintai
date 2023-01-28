import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { HalfwayWorkHour, WorkHour } from "../../api/types";
import { updateArray } from "../../share/utils";
import {
  addWorkHour,
  loadDeal,
  loadWorkHours,
  PartialDeal,
  updateWorkHour,
} from "./utils";
import DeletedWorkHourTable from "./DeletedWorkHourTable";
import ActiveWorkHourTable from "./ActiveWorkHourTable";
import WorkHourEditorDialog from "./WorkHourEditorDialog";
import { secToStr } from "../utils";
type WorkHoursPageProps = {
  dealId: number;
};
function WorkHoursPage({ dealId }: WorkHoursPageProps): JSX.Element {
  const [workHours, setWorkHours] = useState<WorkHour[]>([]);
  const [showDeleted, setShowDeleted] = useState<boolean>(false);
  const [deal, setDeal] = useState<PartialDeal | undefined>();

  const [editedWorkHourId, setEditedWorkHourId] = useState<
    number | "adding" | undefined
  >(undefined);

  useEffect(() => {
    loadWorkHours(dealId).then(setWorkHours);
    loadDeal(dealId).then(setDeal);
  }, [dealId]);

  const handleCancel = async (_: HalfwayWorkHour): Promise<void> => {
    setEditedWorkHourId(undefined);
  };
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
  };
  const handleSave = async (
    wh: Omit<WorkHour, "id"> & { id?: number }
  ): Promise<void> => {
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
      const ret = await updateWorkHour({
        ...wh,
        id: wh.id,
        startTime: wh.startTime,
      });
      setWorkHours((whs) => updateArray(whs, ret));
    } else if (editedWorkHourId === "adding") {
      const ret = await addWorkHour({
        ...wh,
        startTime: wh.startTime,
      });
      setWorkHours((whs) => [...whs, ret]);
    }
  };
  const handleAddClick = () => {
    setEditedWorkHourId("adding");
  };
  const objForEditor =
    typeof editedWorkHourId === "number"
      ? workHours.find((x) => x.id === editedWorkHourId)
      : { dealId: dealId };
  if (objForEditor === undefined) {
    throw new Error("invalid edit number is set");
  }
  let sumDuration = 0;
  for (const wh of workHours.filter((wh) => !wh.isDeleted)) {
    sumDuration += wh.endTime
      ? (wh.endTime.getTime() - wh.startTime.getTime()) / 1000
      : 0;
  }
  return (
    <>
      <Typography variant="h5" component="h2" style={{ padding: "1rem" }}>
        {deal ? deal.name : ""}
      </Typography>
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
        <Typography component="span">
          合計時間 {secToStr(sumDuration)}
        </Typography>
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
        open={editedWorkHourId !== undefined}
        onCancel={handleCancel}
        onSave={handleSave}
        initialObject={objForEditor}
        key={editedWorkHourId}
      />
    </>
  );
}

export default WorkHoursPage;
