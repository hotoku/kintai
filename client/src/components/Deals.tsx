import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchDeals } from "../api/fetches";

import { Deal } from "../api/types";

const createItem = (d: Deal): JSX.Element => {
  return (
    <li key={d.id}>
      <Link to={`/workHours?dealId=${d.id}`}> {d.name}</Link>
    </li>
  );
};

const Deals = () => {
  const [deals, setDeals] = useState<Deal[]>([]);

  useEffect(() => {
    fetchDeals(setDeals);
  }, []);
  return (
    <div className="Deals">
      <ul>{deals.map(createItem)}</ul>
    </div>
  );
};

export default Deals;
