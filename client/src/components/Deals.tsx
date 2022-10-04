import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchDeals } from "../api/fetches";

import { Deal, HalfwayDeal } from "../api/types";

type ViewProps = {
  originalObj: Deal;
  onEditClick: (obj: Deal) => void;
};

const View = ({ originalObj, onEditClick }: ViewProps): JSX.Element => {
  return (
    <tr>
      <td>
        <Link to={`/workHours?dealId=${originalObj.id}`}>
          {originalObj.name}
        </Link>
      </td>
      <td>{originalObj.clientName}</td>
      <td>
        <button onClick={() => onEditClick(originalObj)}>edit</button>
      </td>
    </tr>
  );
};

const createItem = (d: Deal): JSX.Element => {
  return <View key={d.id} originalObj={d} onEditClick={() => {}} />;
};

const Deals = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [editedRecord, setEditedRecord] = useState<HalfwayDeal>({});
  const [editedId, setEditedId] = useState<number | "new" | undefined>();

  useEffect(() => {
    fetchDeals(setDeals);
  }, []);

  return (
    <div className="Deals">
      <table>
        <thead>
          <tr>
            <th>name</th>
            <th>client name</th>
            <th>actions</th>
          </tr>
        </thead>
        <tbody>{deals.map(createItem)}</tbody>
      </table>
      <button>add</button>
    </div>
  );
};

export default Deals;
