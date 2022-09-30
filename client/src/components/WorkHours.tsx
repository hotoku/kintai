import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { fetchWorkHours, postWorkHour, putWorkHour } from "../api/fetches";
import { WorkHour, HalfwayWorkHour } from "../api/types";
import { parseQuery } from "../utils";

import "./WorkHours.css";

interface IEditorProps {
  originalObj?: WorkHour;
  editedObj: HalfwayWorkHour;
  onChange: (obj: HalfwayWorkHour) => void;
  onSaveClick?: (obj: HalfwayWorkHour) => void;
  onUpdateClick?: (obj: WorkHour) => void;
  onCancelClick: (obj: HalfwayWorkHour) => void;
  key: string;
}

interface IViewProps {
  originalObj: WorkHour;
  onEditClick: (obj: WorkHour) => void;
  key: string;
}

type ViewOrEditorProps = IEditorProps & IViewProps;

const Editor = ({
  originalObj,
  editedObj,
  onChange,
  onSaveClick,
  onUpdateClick,
  onCancelClick,
  key,
}: IEditorProps) => {
  const handleChange =
    (name: "startTime" | "endTime") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const diff: any = {};
      diff[name] = e.target.value;
      onChange({
        ...editedObj,
        ...diff,
      });
    };
  let saveOrUpdate: JSX.Element;
  if (onSaveClick !== undefined) {
    saveOrUpdate = <button onClick={() => onSaveClick(editedObj)}>save</button>;
  } else if (onUpdateClick !== undefined) {
    if (originalObj === undefined) {
      throw Error("originalObj is not defined");
    }
    saveOrUpdate = (
      <button
        onClick={() =>
          onUpdateClick({
            id: originalObj.id,
            startTime: originalObj.startTime,
            ...editedObj,
          })
        }
      >
        update
      </button>
    );
  } else {
    throw Error("onSave click or onUpdateClick must be non null");
  }
  return (
    <tr key={key}>
      <td>
        <input
          onChange={handleChange("startTime")}
          type="string"
          value={editedObj.startTime || ""}
          className="list-input"
        />
      </td>
      <td>
        <input
          onChange={handleChange("endTime")}
          type="string"
          value={editedObj.endTime || ""}
          className="list-input"
        />
      </td>
      <td className="list-buttons">
        {saveOrUpdate}
        <button onClick={() => onCancelClick(editedObj)}>cancel</button>
      </td>
    </tr>
  );
};

const View = ({ originalObj, onEditClick, key }: IViewProps) => {
  return (
    <tr key={key}>
      <td className="list-item">{originalObj.startTime}</td>
      <td className="list-item">{originalObj.endTime || "null"}</td>
      <td className="list-buttons">
        <button onClick={() => onEditClick(originalObj)}>edit</button>
      </td>
    </tr>
  );
};

const createViewOrEditor = (
  editedId: number | "new" | undefined,
  props: ViewOrEditorProps
): JSX.Element => {
  const wh = props.originalObj;
  let ret: JSX.Element;
  if (wh.id === editedId) {
    ret = <Editor {...props} />;
  } else {
    ret = <View {...props} />;
  }
  return ret;
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
    <T extends WorkHour | HalfwayWorkHour>(
      sendMethod: (obj: T) => Promise<any>
    ) =>
    async (obj: T) => {
      disableEditing();
      if (!obj.startTime) return;
      await sendMethod(obj);
      fetchWorkHours(dealId, setWorkHours);
    };

  const saveWorkHour = sendWorkHour(postWorkHour);
  const updateWorkHour = sendWorkHour(putWorkHour);

  const startAdding = () => {
    setEditedId("new");
    setEditedRecord({ dealId: dealId });
  };

  const enableEditing = (obj: WorkHour) => {
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
      originalObj: wh,
      editedObj: editedRecord,
      onChange: setEditedRecord,
      onCancelClick: disableEditing,
      onEditClick: enableEditing,
      onUpdateClick: updateWorkHour,
      key: "" + wh.id,
    });
  });

  if (isAdding()) {
    items.push(
      <Editor
        editedObj={editedRecord}
        onChange={handleChange}
        onSaveClick={saveWorkHour}
        onCancelClick={disableEditing}
        key="new"
      />
    );
  }

  console.log(items.map((x) => x.key));

  return (
    <div className="WorkHours" tabIndex={0}>
      <table>
        <tr>
          <th>start time</th>
          <th>end time</th>
          <th>actions</th>
        </tr>
        <tbody>{items}</tbody>
      </table>
      <button onClick={startAdding}>add</button>
    </div>
  );
};

export default WorkHours;
