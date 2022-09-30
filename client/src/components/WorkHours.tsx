import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { fetchWorkHours, postWorkHour, putWorkHour } from "../api/fetches";
import { WorkHour } from "../api/types";
import { parseQuery } from "../utils";

import "./WorkHours.css";

type HalfwayWorkHour = {
  id?: number;
  dealId: number;
  startTime?: string;
  endTime?: string;
};

interface IEditorProps {
  halfObj: HalfwayWorkHour;
  onChange: (obj: HalfwayWorkHour) => void;
  onSaveClick?: (obj: HalfwayWorkHour) => void;
  onUpdateClick?: (obj: HalfwayWorkHour) => void;
  onCancelClick: (obj: HalfwayWorkHour) => void;
}

interface IViewProps {
  obj: WorkHour;
  onEditClick: (obj: HalfwayWorkHour) => void;
}

type ViewOrEditorProps = IEditorProps & IViewProps;

const View = ({ obj, onEditClick }: IViewProps) => {
  return (
    <span>
      <span className="list-item">{obj.startTime}</span>{" "}
      <span className="list-item">{obj.endTime || "null"}</span>
      <button onClick={() => onEditClick(obj)}>edit</button>
    </span>
  );
};

const Editor = ({
  halfObj,
  onChange,
  onSaveClick,
  onUpdateClick,
  onCancelClick,
}: IEditorProps) => {
  const handleChange =
    (name: "startTime" | "endTime") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const diff: any = {};
      diff[name] = e.target.value;
      onChange({
        ...halfObj,
        ...diff,
      });
    };
  let saveOrUpdate: JSX.Element;
  if (onSaveClick !== undefined) {
    saveOrUpdate = <button onClick={() => onSaveClick(halfObj)}>save</button>;
  } else if (onUpdateClick !== undefined) {
    saveOrUpdate = (
      <button onClick={() => onUpdateClick(halfObj)}>update</button>
    );
  } else {
    throw Error("onSave click or onUpdateClick must be non null");
  }
  return (
    <span>
      <input
        onChange={handleChange("startTime")}
        type="string"
        value={halfObj.startTime || ""}
        className="list-input"
      ></input>
      <input
        onChange={handleChange("endTime")}
        type="string"
        value={halfObj.endTime || ""}
        className="list-input"
      ></input>
      {saveOrUpdate}
      <button onClick={() => onCancelClick(halfObj)}>cancel</button>
    </span>
  );
};

const createViewOrEditor = (
  editedId: number | "new" | undefined,
  props: ViewOrEditorProps
): JSX.Element => {
  const wh = props.obj;
  let ret: JSX.Element;
  if (wh.id === editedId) {
    ret = <Editor {...props} />;
  } else {
    ret = <View {...props} />;
  }
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
  const [editedId, setEditedId] = useState<number | "new" | undefined>();

  const isAdding = () => editedId === "new";

  useEffect(() => {
    fetchWorkHours(dealId, setWorkHours);
  }, [dealId]);

  const sendWorkHour =
    (sendMethod: (obj: WorkHour) => Promise<any>) =>
    async (wh: HalfwayWorkHour) => {
      if (!wh.startTime) return;
      const obj: WorkHour = { ...wh, startTime: wh.startTime };
      await sendMethod(obj);
      fetchWorkHours(dealId, setWorkHours);
      disableEditing();
    };

  const saveWorkHour = sendWorkHour(postWorkHour);
  const updateWorkHour = sendWorkHour(putWorkHour);

  const startAdding = () => {
    setEditedId("new");
    setEditedRecord({ dealId: dealId });
  };

  const enableEditing = (obj: HalfwayWorkHour) => {
    setEditedId(obj.id);
    setEditedRecord({ ...obj });
  };

  const disableEditing = (_: any = null) => {
    setEditedId(undefined);
    setEditedRecord({ dealId: dealId });
  };

  const handleChange = (obj: HalfwayWorkHour) => {
    setEditedRecord(obj);
  };

  const items = workHours.map((wh) => {
    return createViewOrEditor(editedId, {
      obj: wh,
      halfObj: editedRecord,
      onChange: setEditedRecord,
      onCancelClick: disableEditing,
      onEditClick: enableEditing,
      onUpdateClick: updateWorkHour,
    });
  });

  if (isAdding()) {
    items.push(
      <li key="new">
        <Editor
          halfObj={editedRecord}
          onChange={handleChange}
          onSaveClick={saveWorkHour}
          onCancelClick={disableEditing}
        />
      </li>
    );
  }

  return (
    <div className="WorkHours" tabIndex={0}>
      <ul>{items}</ul>
      <button onClick={startAdding}>add</button>
    </div>
  );
};

export default WorkHours;
