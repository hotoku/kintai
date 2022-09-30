import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { fetchWorkHours, postWorkHour, putWorkHour } from "../api/fetches";
import { WorkHour } from "../api/types";
import { parseQuery } from "../utils";

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
      {obj.startTime}, {obj.endTime || "null"}{" "}
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
      ></input>
      <input
        onChange={handleChange("endTime")}
        type="string"
        value={halfObj.endTime || ""}
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
    console.log("handleChange", obj);
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
      <button onClick={startAdding}>add</button>
      <ul>{items}</ul>
    </div>
  );
};

export default WorkHours;
