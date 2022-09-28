import { useEffect, useState } from "react";
import { fetchWorkHours } from "../api/fetches";

import { WorkHour } from "../api/types";

interface IProps {
  dealId: number;
}

const createItem = (wh: WorkHour): JSX.Element => {
  return (
    <li key={wh.id}>
      {wh.startTime}, {wh.endTime || "null"}
    </li>
  );
};

const WorkHours = ({ dealId }: IProps) => {
  const [workHours, setWorkHours] = useState<WorkHour[]>([]);

  useEffect(() => {
    fetchWorkHours(dealId, setWorkHours);
  }, [dealId]);
  return (
    <div className="WorkHours">
      <ul>{workHours.map(createItem)}</ul>
    </div>
  );
};

export default WorkHours;
