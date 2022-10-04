import { useEffect, useState } from "react";
import { fetchClients, postClient, putClient } from "../api/fetches";
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
  editedObj: HalfwayClient;
  onSaveClick: (obj: HalfwayClient) => void;
  onCancelClick: (obj: HalfwayClient) => void;
  onChange: (obj: HalfwayClient) => void;
  saveButtonName: string;
};

const Editor = ({
  editedObj,
  onSaveClick,
  onCancelClick,
  onChange,
  saveButtonName,
}: EditorProps): JSX.Element => {
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
            const obj: HalfwayClient = { ...editedObj };
            obj.name = editedObj.name;
            onSaveClick(obj);
          }}
        >
          {saveButtonName}
        </button>
        <button onClick={() => onCancelClick(editedObj)}>cancel</button>
      </td>
    </tr>
  );
};

const updateEditor = (
  originalObj: Client,
  { editedObj, onSaveClick, onCancelClick, onChange }: EditorProps
): JSX.Element => {
  editedObj.id = originalObj.id;
  return (
    <Editor
      key={originalObj.id}
      editedObj={editedObj}
      onSaveClick={onSaveClick}
      onCancelClick={onCancelClick}
      onChange={onChange}
      saveButtonName="update"
    />
  );
};

const addEditor = (props: EditorProps): JSX.Element => {
  return <Editor key="new" {...props} />;
};

const createItem = (
  editedId: number | "new" | undefined,
  props: ViewProps & EditorProps
): JSX.Element => {
  if (editedId === props.originalObj.id) {
    return updateEditor(props.originalObj, props);
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

  const startEditing = () => {
    setEditedId("new");
    setEditedRecord({});
  };

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

  const updateClient = async (obj: HalfwayClient) => {
    if (obj.id === undefined) return;
    if (obj.name === undefined) return;
    disableEditing();
    await putClient({ ...obj } as Client);
    fetchClients(setClients);
  };

  const addClient = async (obj: HalfwayClient) => {
    if (obj.name === undefined) return;
    disableEditing();
    await postClient(obj);
    fetchClients(setClients);
  };

  const records = clients.map((obj) => {
    return createItem(editedId, {
      originalObj: obj,
      editedObj: editedRecord,
      onEditClick: enableEditing,
      onCancelClick: disableEditing,
      onSaveClick: updateClient,
      onChange: setEditedRecord,
      saveButtonName: "update",
    });
  });

  if (editedId === "new") {
    records.push(
      addEditor({
        editedObj: editedRecord,
        onCancelClick: disableEditing,
        onSaveClick: addClient,
        onChange: setEditedRecord,
        saveButtonName: "save",
      })
    );
  }

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
      <button onClick={startEditing}>add</button>
    </div>
  );
};

export default Clients;
