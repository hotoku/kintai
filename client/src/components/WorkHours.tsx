import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";

import { formatDate, formatTime } from "../share/utils";
import {
  fetchWorkHours,
  postWorkHour,
  putWorkHour,
  deleteWorkHour as _deleteWorkHour,
} from "../api/fetches";
import { WorkHour, HalfwayWorkHour } from "../api/types";
import { parseQuery } from "../utils";
import { Table } from "./Table";

import Style from "./WorkHours.module.css";

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
  onDeleteClick: (obj: WorkHour) => void;
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
    saveOrUpdate = (
      <button className={Style.button} onClick={() => onSaveClick(editedObj)}>
        save
      </button>
    );
  } else if (onUpdateClick !== undefined) {
    if (originalObj === undefined) {
      throw Error("originalObj is not defined");
    }
    saveOrUpdate = (
      <button
        className={Style.button}
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
    <div></div>,
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
    <div />,
    <div className={Style.action}>
      {saveOrUpdate}
      <button className={Style.button} onClick={() => onCancelClick(editedObj)}>
        cancel
      </button>
    </div>,
  ];
};

const secToStr = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const m = ("" + (minutes % 60)).padStart(2, "0");
  const hours = Math.floor(minutes / 60);
  return `${hours}:${m}`;
};

const view = ({
  originalObj,
  onEditClick,
  onDeleteClick,
}: ViewProps): JSX.Element[] => {
  const st = originalObj.startTime;
  const date = formatDate(st);
  const startTime = formatTime(st);
  const endTiime = originalObj.endTime ? formatTime(originalObj.endTime) : "";
  const dateDiffers = (() => {
    if (!originalObj.endTime) return false;
    return date !== formatDate(originalObj.endTime);
  })();

  const duration = originalObj.endTime
    ? (originalObj.endTime.getTime() - originalObj.startTime.getTime()) / 1000
    : 0;

  return [
    <div className={Style.date}>{date}</div>,
    <div className={Style.time}>{startTime}</div>,
    <div className={`${Style.time} ${dateDiffers ? Style.dateDiffAlert : ""}`}>
      {endTiime}
    </div>,
    <div className={Style.time}>{secToStr(duration)}</div>,
    <div className={Style.action}>
      <button className={Style.button} onClick={() => onEditClick(originalObj)}>
        edit
      </button>
      <button
        className={`${Style.button} ${Style.deleteButton}`}
        onClick={() => onDeleteClick(originalObj)}
      >
        delete
      </button>
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

type SumProps = {
  whs: WorkHour[];
};

const Sum = ({ whs }: SumProps): JSX.Element => {
  let sum = 0;
  for (const wh of whs) {
    if (wh.endTime) {
      sum += wh.endTime.getTime() - wh.startTime.getTime();
    }
  }
  sum /= 1000 * 3600;
  return (
    <div>
      <span>合計時間</span>:
      <span>
        {Intl.NumberFormat("ja-JP", { maximumSignificantDigits: 4 }).format(
          sum
        )}
      </span>
    </div>
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

  const deleteWorkHour = async (obj: WorkHour): Promise<void> => {
    disableEditing();
    await _deleteWorkHour(obj);
    fetchWorkHours(dealId, setWorkHours);
  };

  const items: JSX.Element[][] = workHours.map((wh) => {
    return createViewOrEditor(editedId, {
      originalObj: wh,
      editedObj: editedRecord,
      onChange: setEditedRecord,
      onCancelClick: disableEditing,
      onEditClick: enableEditing,
      onUpdateClick: updateWorkHour,
      onDeleteClick: deleteWorkHour,
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
      <Sum whs={workHours} />
      <Table
        thead={[
          <div>date</div>,
          <div>start</div>,
          <div>end</div>,
          <div>duration</div>,
          <div>actions</div>,
        ]}
        rows={items}
      />
      <button onClick={startAdding}>add</button>
    </div>
  );
};

export default WorkHours;
