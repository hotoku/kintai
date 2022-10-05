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

type EditorProps = {
  editedObj: HalfwayDeal;
  onChange: (obj: HalfwayDeal) => void;
  onSaveClick: (obj: HalfwayDeal) => void;
  onCancelClick: (obj: HalfwayDeal) => void;
  saveButtonLabel: string;
};
const Editor = ({
  editedObj,
  onChange,
  onSaveClick,
  onCancelClick,
  saveButtonLabel,
}: EditorProps): JSX.Element => {
  return (
    <tr>
      <td>
        <input value={editedObj.name} onChange={() => onChange(editedObj)} />
      </td>
      <td>
        <select
          onChange={(e) => {
            console.log(e.target.value);
          }}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
        </select>
      </td>
      <td>
        <button onClick={() => onSaveClick(editedObj)}>
          {saveButtonLabel}
        </button>
        <button onClick={() => onCancelClick(editedObj)}>cancel</button>
      </td>
    </tr>
  );
};

const createItem = (
  editedId: number | "new" | undefined,
  props: EditorProps & ViewProps
): JSX.Element => {
  if (editedId === props.originalObj.id) {
    return <Editor key={props.originalObj.id} {...props} />;
  } else {
    return <View key={props.originalObj.id} {...props} />;
  }
};

const Deals = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [editedRecord, setEditedRecord] = useState<HalfwayDeal>({});
  const [editedId, setEditedId] = useState<number | "new" | undefined>();

  useEffect(() => {
    fetchDeals(setDeals);
  }, []);

  const enableEditing = (obj: HalfwayDeal) => {
    setEditedId(obj.id);
    setEditedRecord({ ...obj });
  };

  const disableEditing = (_: HalfwayDeal) => {
    setEditedId(undefined);
    setEditedRecord({});
  };
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
        <tbody>
          {deals.map((obj) =>
            createItem(editedId, {
              originalObj: obj,
              editedObj: editedRecord,
              onChange: () => {},
              onSaveClick: () => {},
              onCancelClick: disableEditing,
              saveButtonLabel: "update",
              onEditClick: enableEditing,
            })
          )}
        </tbody>
      </table>
      <button>add</button>
    </div>
  );
};

export default Deals;
