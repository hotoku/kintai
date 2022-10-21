import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { fetchWorkHours, putWorkHour } from "../api/fetches";
import { WorkHour } from "../api/types";
import { parseQuery } from "../utils";
import { Table } from "./Table";
import { formatDate, formatTime } from "./utils";

const view = (
  wh: WorkHour,
  onRecoverClick: (wh: WorkHour) => void
): JSX.Element[] => {
  const st = `${formatDate(wh.startTime)} ${formatTime(wh.startTime)}`;
  const et = wh.endTime
    ? `${formatDate(wh.endTime)} ${formatTime(wh.endTime)}`
    : "";
  return [
    <div>{st}</div>,
    <div>{et}</div>,
    <button onClick={() => onRecoverClick(wh)}>recover</button>,
  ];
};

const DeletedWorkHours = (): JSX.Element => {
  const query = parseQuery(useLocation().search);
  if (query["dealId"] === undefined) {
    throw Error("query parameter dealId is not given");
  }
  const dealId = parseInt(query["dealId"]);
  if (Number.isNaN(dealId)) {
    throw Error(`query parameter dealId is invalid: ${query["dealId"]}`);
  }

  const [workHours, setWorkHours] = useState<WorkHour[]>([]);

  const fetch = useCallback(() => {
    fetchWorkHours(
      dealId,
      (x: WorkHour[]) => {
        setWorkHours(x);
      },
      true
    );
  }, [setWorkHours, dealId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const recoverWorkHour = async (wh: WorkHour) => {
    await putWorkHour({
      ...wh,
      isDeleted: false,
    });
    fetch();
  };

  const lines = workHours.map((w) => view(w, recoverWorkHour));
  return (
    <div>
      <Table
        thead={[<div>start time</div>, <div>end time</div>, <div>actions</div>]}
        rows={lines}
      />
      <p>
        <Link to={`/workHours?dealId=${dealId}`}>back</Link>
      </p>
    </div>
  );
};

export default DeletedWorkHours;
