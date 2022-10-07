import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";

import { formatDate, formatTime } from "../share/utils";

import { fetchWorkHours, postWorkHour, putWorkHour } from "../api/fetches";
import { WorkHour, HalfwayWorkHour } from "../api/types";
import { parseQuery } from "../utils";

import "./WorkHours.css";
import { Table } from "./Table";

type EditorProps = {
  originalObj?: WorkHour;
  editedObj: HalfwayWorkHour;
  onChange: (obj: HalfwayWorkHour) => void;
  onSaveClick?: (obj: HalfwayWorkHour) => void;
  onUpdateClick?: (obj: WorkHour) => void;
  onCancelClick: (obj: HalfwayWorkHour) => void;
  key: string;
};

type ViewProps = {
  originalObj: WorkHour;
  onEditClick: (obj: WorkHour) => void;
  key: string;
};

type ViewOrEditorProps = EditorProps & ViewProps;

const editor = ({
  originalObj,
  editedObj,
  onChange,
  onSaveClick,
  onUpdateClick,
  onCancelClick,
}: EditorProps): JSX.Element[] => {
  const handleChange = (name: "startTime" | "endTime") => (e: Date) => {
    const newOne = { ...editedObj };
    newOne[name] = e;
    onChange(newOne);
  };

  const handleClockOpen = (name: "startTime" | "endTime") => () => {
    const obj = editedObj[name];
    if (obj === undefined) {
      const newOne = { ...editedObj };
      newOne[name] = new Date();
      onChange(newOne);
    }
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
  return [
    <div>
      <DateTimePicker
        onChange={handleChange("startTime")}
        onClockOpen={handleClockOpen("startTime")}
        value={editedObj.startTime}
      />
    </div>,
    <div>
      <DateTimePicker
        onChange={handleChange("endTime")}
        onClockOpen={handleClockOpen("endTime")}
        value={editedObj.endTime}
      />
    </div>,
    <div className="list-buttons">
      {saveOrUpdate}
      <button onClick={() => onCancelClick(editedObj)}>cancel</button>
    </div>,
  ];
};

const view = ({ originalObj, onEditClick }: ViewProps): JSX.Element[] => {
  const st = originalObj.startTime;
  const startDate = st ? `${formatDate(st, false)}` : "";
  const startTime = st ? `${formatTime(st, false)}` : "";
  const et = originalObj.endTime;
  const endDate = et ? `${formatDate(et, false)}` : "";
  const endTime = et ? `${formatTime(et, false)}` : "";

  return [
    <div className="list-item">{`${startDate} ${startTime}`}</div>,
    <div className="list-item">{`${endDate} ${endTime}`}</div>,
    <div className="list-buttons">
      ,<button onClick={() => onEditClick(originalObj)}>edit</button>
    </div>,
  ];
};

const createViewOrEditor = (
  editedId: number | "new" | undefined,
  props: ViewOrEditorProps
): JSX.Element[] => {
  const wh = props.originalObj;
  let ret: JSX.Element[];
  if (wh.id === editedId) {
    ret = editor(props);
  } else {
    ret = view(props);
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

  const items: JSX.Element[][] = workHours.map((wh) => {
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
      editor({
        editedObj: editedRecord,
        onChange: setEditedRecord,
        onSaveClick: saveWorkHour,
        onCancelClick: disableEditing,
        key: "new",
      })
    );
  }

  return (
    <div className="WorkHours" tabIndex={0}>
      <Table
        thead={
          <tr>
            <th>start time</th>
            <th>end time</th>
            <th>actions</th>
          </tr>
        }
        rows={items}
      />
      <button onClick={startAdding}>add</button>
      <table>
        <thead>
          <tr>
            <th>start time</th>
            <th>end time</th>
            <th>actions</th>
          </tr>
        </thead>
      </table>
    </div>
  );
};

export default WorkHours;
