import { useEffect, useState } from "react";
import { fetchClients, putClient } from "../api/fetches";
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

type EditorProps = {
  originalObj?: Client;
  editedObj: HalfwayClient;
  onUpdateClick: (obj: Client) => void;
  onCancelClick: (obj: HalfwayClient) => void;
  onChange: (obj: HalfwayClient) => void;
};

const Editor = ({
  originalObj,
  editedObj,
  onUpdateClick,
  onCancelClick,
  onChange,
}: EditorProps): JSX.Element => {
  if (originalObj === undefined) {
    throw Error("originalObj is undefined");
  }
  return (
    <tr>
      <td>
        <input
          value={editedObj.name || ""}
          onChange={(e) => {
            const newOne = { ...editedObj };
            newOne.name = e.target.value;
            onChange(newOne);
          }}
        ></input>
      </td>
      <td>
        <button
          onClick={() => {
            if (editedObj.name === undefined) return;
            const obj: Client = { ...originalObj };
            obj.name = editedObj.name;
            onUpdateClick(obj);
          }}
        >
          update
        </button>
        <button onClick={() => onCancelClick(editedObj)}>cancel</button>
      </td>
    </tr>
  );
};

const createItem = (
  editedId: number | "new" | undefined,
  props: ViewProps & EditorProps
): JSX.Element => {
  if (editedId === props.originalObj.id) {
    return <Editor key={props.originalObj.id} {...props} />;
  } else {
    return <View key={props.originalObj.id} {...props} />;
  }
};

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [editedId, setEditedId] = useState<number | "new" | undefined>();
  const [editedRecord, setEditedRecord] = useState<HalfwayClient>({});
  useEffect(() => {
    fetchClients(setClients);
  }, []);

  const enableEditing = (obj: Client) => {
    setEditedId(obj.id);
    setEditedRecord({
      id: obj.id,
      name: obj.name,
    });
  };

  const disableEditing = () => {
    setEditedId(undefined);
    setEditedRecord({});
  };

  const sendClient = async (obj: Client) => {
    disableEditing();
    await putClient(obj);
    fetchClients(setClients);
  };

  const records = clients.map((obj) => {
    return createItem(editedId, {
      originalObj: obj,
      editedObj: editedRecord,
      onEditClick: enableEditing,
      onUpdateClick: sendClient,
      onCancelClick: disableEditing,
      onChange: setEditedRecord,
    });
  });

  return (
    <div className="Clients">
      <table>
        <thead>
          <tr>
            <th>name</th>
            <th>actions</th>
          </tr>
        </thead>
        <tbody>{records}</tbody>
      </table>
      <button>add</button>
    </div>
  );
};

export default Clients;
