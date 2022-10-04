import { useEffect, useState } from "react";
import { fetchClients } from "../api/fetches";
import { Client, HalfwayClient } from "../api/types";

type ViewProps = {
  originalObj: Client;
  onEditClick: (obj: Client) => void;
};

const View = ({ originalObj, onEditClick }: ViewProps): JSX.Element => {
  return (
    <tr>
      <td>{originalObj.name}</td>
      <td>
        <button onClick={() => onEditClick(originalObj)}>edit</button>
      </td>
    </tr>
  );
};

const createItem = (
  editedId: number | "new" | undefined,
  props: ViewProps
): JSX.Element => {
  if (editedId === props.originalObj.id) {
    return (
      <tr>
        <td> this object is edited </td>
      </tr>
    );
  } else {
    return <View key={props.originalObj.id} {...props} />;
  }
};

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [editedId, setEditedId] = useState<number | "new" | undefined>();
  const [editedRecord, setEditedRecord] = useState<HalfwayClient>({});

  const handleEditClick = (obj: Client) => {
    setEditedId(obj.id);
  };

  useEffect(() => {
    fetchClients(setClients);
  }, []);
  return (
    <div className="Clients">
      <table>
        <thead>
          <tr>
            <th>name</th>
            <th>actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((obj) => {
            return createItem(editedId, {
              originalObj: obj,
              onEditClick: handleEditClick,
            });
          })}
        </tbody>
      </table>
      <button>add</button>
    </div>
  );
};

export default Clients;
