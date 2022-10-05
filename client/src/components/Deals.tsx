import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchClients, fetchDeals, putDeal } from "../api/fetches";

import { Client, Deal, HalfwayDeal } from "../api/types";

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
  clients: Client[];
};
const Editor = ({
  editedObj,
  onChange,
  onSaveClick,
  onCancelClick,
  saveButtonLabel,
  clients,
}: EditorProps): JSX.Element => {
  return (
    <tr>
      <td>
        <input
          value={editedObj.name}
          onChange={(e) => {
            const newOne = { ...editedObj };
            newOne.name = e.target.value;
            onChange(newOne);
          }}
        />
      </td>
      <td>
        <select
          value={editedObj.clientId}
          onChange={(e) => {
            const newOne = { ...editedObj };
            newOne.clientId = parseInt(e.target.value);

            let selected: Client | undefined;
            for (const c of clients) {
              if (c.id === newOne.clientId) {
                selected = c;
              }
            }
            console.log(selected);
            onChange(newOne);
          }}
        >
          {clients.map((c) => {
            return (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            );
          })}
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
  const [clients, setClients] = useState<Client[]>([]);
  const [editedRecord, setEditedRecord] = useState<HalfwayDeal>({});
  const [editedId, setEditedId] = useState<number | "new" | undefined>();

  useEffect(() => {
    fetchDeals(setDeals);
    fetchClients(setClients);
  }, []);

  const enableEditing = (obj: HalfwayDeal) => {
    setEditedId(obj.id);
    setEditedRecord({ ...obj });
  };

  const disableEditing = () => {
    setEditedId(undefined);
    setEditedRecord({});
  };

  const updateDeal = async (obj: HalfwayDeal) => {
    if (
      obj.id === undefined ||
      obj.name === undefined ||
      obj.clientId === undefined
    ) {
      return;
    }
    await putDeal({
      id: obj.id,
      name: obj.name,
      clientId: obj.clientId,
    });
    disableEditing();
    fetchDeals(setDeals);
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
              onChange: setEditedRecord,
              onSaveClick: updateDeal,
              onCancelClick: disableEditing,
              saveButtonLabel: "update",
              onEditClick: enableEditing,
              clients: clients,
            })
          )}
        </tbody>
      </table>
      <button>add</button>
    </div>
  );
};

export default Deals;
