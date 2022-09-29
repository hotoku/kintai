import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import { fetchWorkHours, postWorkHours } from "../api/fetches";
import { WorkHour } from "../api/types";
import { parseQuery } from "../utils";

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

const WorkHours = () => {
  const query = parseQuery(useLocation().search);
  if (query["dealId"] === undefined) {
    throw Error("query parameter dealId is not given");
  }
  const dealId = parseInt(query["dealId"]);
  if (Number.isNaN(dealId)) {
    throw Error(`query parameter dealId is invalid: ${query["dealId"]}`);
  }

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

  const handleSave = async (wh: HalfwayWorkHour) => {
    if (!wh.startTime) return;
    const obj: WorkHour = { ...wh, startTime: wh.startTime };
    await postWorkHours(obj);
    fetchWorkHours(dealId, setWorkHours);
    setIsAdding(false);
    setHalfWorkHour({ dealId: dealId });
  };

  const items = workHours.map(createItem);
  if (isAdding) {
    items.push(
      <li key="editor">
        <Editor
          currentObj={halfWorkHour}
          onChange={setHalfWorkHour}
          onSave={handleSave}
          onCancel={() => setIsAdding(false)}
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
