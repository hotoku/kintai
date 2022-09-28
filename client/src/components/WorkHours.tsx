import { useEffect, useState } from "react";
import { fetchWorkHours } from "../api/fetches";

import { WorkHour } from "../api/types";

interface IProps {
  dealId: number;
}

type UncompleteWorkHour = {
  dealid?: number;
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

const createEditor = (): JSX.Element => {
  return <li key="hoge">hoge</li>;
};

const WorkHours = ({ dealId }: IProps) => {
  const [workHours, setWorkHours] = useState<WorkHour[]>([]);
  const [uWorkHours, setUWorkHours] = useState<UncompleteWorkHour>({});
  const [adding, setAdding] = useState<boolean>(false);

  useEffect(() => {
    fetchWorkHours(dealId, setWorkHours);
  }, [dealId]);

  const handleAdd = () => {
    setAdding(true);
  };

  const items = workHours.map(createItem);
  if (adding) {
    items.push(createEditor());
  }

  return (
    <div className="WorkHours">
      <button onClick={handleAdd}>add</button>
      <ul>{items}</ul>
    </div>
  );
};

export default WorkHours;
