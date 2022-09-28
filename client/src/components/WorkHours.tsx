import React, { useEffect, useState } from "react";

import { fetchWorkHours } from "../api/fetches";
import { WorkHour } from "../api/types";

type HalfwayWorkHour = {
  dealId: number;
  startTime?: string;
  endTime?: string;
};

const createItem = (wh: WorkHour): JSX.Element => {
  return (
    <li key={wh.id}>
      {wh.startTime}, {wh.endTime || "null"}
    </li>
  );
};

interface IEditorProps {
  currentObj: HalfwayWorkHour;
  onChange: (obj: HalfwayWorkHour) => void;
  onSave: (obj: HalfwayWorkHour) => void;
  onCancel: (obj: HalfwayWorkHour) => void;
}

const Editor = ({ currentObj, onChange, onSave, onCancel }: IEditorProps) => {
  const handleChange =
    (name: "startTime" | "endTime") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const diff: any = {};
      diff[name] = e.target.value;
      onChange({
        ...currentObj,
        ...diff,
      });
    };
  return (
    <span>
      <input
        onChange={handleChange("startTime")}
        type="string"
        value={currentObj.startTime || ""}
      ></input>
      <input
        onChange={handleChange("endTime")}
        type="string"
        value={currentObj.endTime || ""}
      ></input>
      <button onClick={() => onSave(currentObj)}>save</button>
      <button onClick={() => onCancel(currentObj)}>cancel</button>
    </span>
  );
};

interface IWorkHoursProps {
  dealId: number;
}

const WorkHours = ({ dealId }: IWorkHoursProps) => {
  const [workHours, setWorkHours] = useState<WorkHour[]>([]);
  const [halfWorkHour, setHalfWorkHour] = useState<HalfwayWorkHour>({
    dealId: dealId,
  });
  const [isAdding, setIsAdding] = useState<boolean>(false);

  useEffect(() => {
    fetchWorkHours(dealId, setWorkHours);
  }, [dealId]);

  const handleAddClick = () => {
    setIsAdding(true);
  };

  const addWorkHour = (wh: WorkHour) => {
    setWorkHours(workHours.concat([wh]));
    setIsAdding(false);
  };

  const items = workHours.map(createItem);
  if (isAdding) {
    items.push(
      <li key="editor">
        <Editor
          currentObj={halfWorkHour}
          onChange={setHalfWorkHour}
          onSave={(obj) => {
            if (!obj.startTime) return;
            addWorkHour({
              dealId: obj.dealId,
              startTime: obj.startTime,
              endTime: obj.endTime,
            });
            setHalfWorkHour({ dealId: dealId });
          }}
          onCancel={() => {
            setIsAdding(false);
          }}
        />
      </li>
    );
  }

  return (
    <div className="WorkHours">
      <button onClick={handleAddClick}>add</button>
      <ul>{items}</ul>
    </div>
  );
};

export default WorkHours;
