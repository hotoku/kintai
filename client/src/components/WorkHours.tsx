import { useEffect, useState } from "react";
import { fetchWorkHours } from "../api/fetches";

import { WorkHour } from "../api/types";

interface IProps {
  dealId: number;
}

interface HalfwayWorkHour {
  dealId?: number;
  startTime?: string;
  endTime?: string;
}

const createItem = (wh: WorkHour): JSX.Element => {
  return (
    <li key={wh.id}>
      {wh.startTime}, {wh.endTime || "null"}
    </li>
  );
};

const createEditor = (
  obj: HalfwayWorkHour,
  cb: (w: WorkHour) => void
): JSX.Element => {
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

const WorkHours = ({ dealId }: IProps) => {
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
      <button onClick={handleAddClick}>add</button>
      <ul>{items}</ul>
    </div>
  );
};

export default WorkHours;
