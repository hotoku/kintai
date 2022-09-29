import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { fetchWorkHours, postWorkHours } from "../api/fetches";
import { WorkHour } from "../api/types";
import { parseQuery } from "../utils";

type HalfwayWorkHour = {
  id?: number;
  dealId: number;
  startTime?: string;
  endTime?: string;
};

interface IEditorProps {
  currentObj: HalfwayWorkHour;
  onChange: (obj: HalfwayWorkHour) => void;
  onSave: (obj: HalfwayWorkHour) => void;
  onCancel: (obj: HalfwayWorkHour) => void;
}

interface IViewProps {
  currentObj: HalfwayWorkHour;
  onEdit: (obj: HalfwayWorkHour) => void;
}

type ViewOrEditorProps = IEditorProps & IViewProps;

const View = ({ currentObj, onEdit }: IViewProps) => {
  return (
    <span>
      {currentObj.startTime}, {currentObj.endTime || "null"}
    </span>
  );
};

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

const createViewOrEditor = (
  editedId: number | "new" | undefined,
  props: ViewOrEditorProps
): JSX.Element => {
  const wh = props.currentObj;
  const ret = wh.id === editedId ? <Editor {...props} /> : <View {...props} />;
  return <li key={wh.id}>{ret}</li>;
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
  const [editedRecord, setEditedRecord] = useState<HalfwayWorkHour>({
    dealId: dealId,
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedId, setEditedId] = useState<number | "new" | undefined>();

  useEffect(() => {
    fetchWorkHours(dealId, setWorkHours);
  }, [dealId]);

  const handleAddClick = () => {
    setIsEditing(true);
    setEditedId("new");
  };

  const handleEditClick = (wh: HalfwayWorkHour) => {
    const id = wh.id;
    setEditedId(id);
    setIsEditing(true);
  };

  const handleSave = async (wh: HalfwayWorkHour) => {
    if (!wh.startTime) return;
    const obj: WorkHour = { ...wh, startTime: wh.startTime };
    await postWorkHours(obj);
    fetchWorkHours(dealId, setWorkHours);
    setIsEditing(false);
    setEditedRecord({ dealId: dealId });
  };

  const handleCancel = (_: any) => {
    setEditedRecord({ dealId: dealId });
    setIsEditing(false);
  };

  const items = workHours.map((wh) => {
    return createViewOrEditor(editedId, {
      currentObj: editedRecord,
      onChange: (wh) => setEditedRecord(wh),
      onSave: handleSave,
      onCancel: handleCancel,
      onEdit: handleEditClick,
    });
  });

  if (isEditing) {
    items.push(
      <li key="new">
        <Editor
          currentObj={editedRecord}
          onChange={setEditedRecord}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </li>
    );
  }

  return (
    <div
      className="WorkHours"
      tabIndex={0}
      onKeyDown={(e) => {
        console.log(e.code);
        if (e.code == "KeyA") {
          handleAddClick();
        }
      }}
    >
      <button onClick={handleAddClick}>add</button>
      <ul>{items}</ul>
    </div>
  );
};

export default WorkHours;
