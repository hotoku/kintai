import { Box, Button, FormControlLabel, Switch } from "@mui/material";
import { useEffect, useState } from "react";
import { HalfwayWorkHour, WorkHour } from "../../api/types";
import { updateArray } from "../../share/utils";
import { addWorkHour, loadWorkHours, updateWorkHour } from "./utils";
import DeletedWorkHourTable from "./DeletedWorkHourTable";
import ActiveWorkHourTable from "./ActiveWorkHourTable";
import WorkHourEditorDialog from "./WorkHourEditorDialog";

type WorkHoursPageProps = {
  dealId: number;
};
function WorkHoursPage({ dealId }: WorkHoursPageProps): JSX.Element {
  const [workHours, setWorkHours] = useState<WorkHour[]>([]);
  const [showDeleted, setShowDeleted] = useState<boolean>(false);

  const [editedWorkHourId, setEditedWorkHourId] = useState<
    number | "adding" | undefined
  >(undefined);

  useEffect(() => {
    loadWorkHours(dealId).then(setWorkHours);
  }, []);

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
    wh: Omit<WorkHour, "id"> & { id: number | undefined }
  ): Promise<void> => {
    setEditedWorkHourId(undefined);
    if (!wh.startTime) {
      console.log("start time must not be null");
      return;
    }
    if (!wh.dealId)
      throw new Error("work hour of no deal id was passed to editor");
    if (typeof editedWorkHourId === "number") {
      if (!wh.id) throw new Error("editing instance of no id");
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
