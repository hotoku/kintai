import { useEffect, useState } from "react";
import { fetchDeals } from "../api/fetches";

import { Deal } from "../api/types";

const createItem = (d: Deal): JSX.Element => {
  return <li key={d.id}>{d.name} </li>;
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
