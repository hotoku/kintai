import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchWorkHours } from "../api/fetches";
import { WorkHour } from "../api/types";
import { parseQuery } from "../utils";

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

  useEffect(() => {
    fetchWorkHours(
      dealId,
      (x: WorkHour[]) => {
        setWorkHours(x);
      },
      true
    );
  }, []);
  return <div />;
};

export default DeletedWorkHours;
