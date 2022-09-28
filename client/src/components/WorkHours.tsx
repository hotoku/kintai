import { useEffect, useState } from "react";

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
  obj: HalfwayWorkHour;
  onChange: (obj: HalfwayWorkHour) => void;
}

const Editor = ({ obj, onChange }: IEditorProps) => {
  const [val, setVal] = useState(1);
  return (
    <input
      onChange={(e) => {
        setVal(new Number(e.target.value).valueOf());
      }}
      type="number"
      value={val}
    ></input>
  );
};

const createEditor = (obj: HalfwayWorkHour, cb: (w: WorkHour) => void) => {
  const onclick = () => {
    if (obj.dealId === undefined || obj.startTime === undefined) {
      console.log("not create");
      return;
    }
    const ret: WorkHour = {
      dealId: obj.dealId,
      startTime: obj.startTime,
      endTime: obj.endTime,
    };
    cb(ret);
  };

  return (
    <li key="halfway">
      {obj.startTime || "null"}, {obj.endTime || "null"}
      <button onClick={onclick}>save</button>
    </li>
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
    items.push(createEditor(halfWorkHour, setHalfWorkHour));
  }

  return (
    <div className="WorkHours">
      <Editor {...{ obj: { dealId: 100 }, onChange: (x: any) => {} }} />
      <button onClick={handleAddClick}>add</button>
      <ul>{items}</ul>
    </div>
  );
};

export default WorkHours;
