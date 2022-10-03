import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchDeals } from "../api/fetches";

import { Deal } from "../api/types";

const createItem = (d: Deal): JSX.Element => {
  return (
    <tr key={d.id}>
      <td>
        <Link to={`/workHours?dealId=${d.id}`}> {d.name}</Link>
      </td>
    </tr>
  );
};

const Deals = () => {
  const [deals, setDeals] = useState<Deal[]>([]);

  useEffect(() => {
    fetchDeals(setDeals);
  }, []);
  return (
    <div className="Deals">
      <table>
        <thead>
          <tr>
            <th>name</th>
          </tr>
        </thead>
        <tbody>{deals.map(createItem)}</tbody>
      </table>
    </div>
  );
};

export default Deals;
