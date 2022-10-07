import { useEffect, useState } from "react";
import { fetchClients, postClient, putClient } from "../api/fetches";
import { Client, HalfwayClient } from "../api/types";
import { Table } from "./Table";

type ViewProps = {
  originalObj: Client;
  onEditClick: (obj: Client) => void;
};

const view = ({ originalObj, onEditClick }: ViewProps): JSX.Element[] => {
  return [
    <div>{originalObj.name}</div>,
    <div>
      <button onClick={() => onEditClick(originalObj)}>edit</button>
    </div>,
  ];
};

type EditorProps = {
  editedObj: HalfwayClient;
  onSaveClick: (obj: HalfwayClient) => void;
  onCancelClick: (obj: HalfwayClient) => void;
  onChange: (obj: HalfwayClient) => void;
  saveButtonName: string;
};

const editor = ({
  editedObj,
  onSaveClick,
  onCancelClick,
  onChange,
  saveButtonName,
}: EditorProps): JSX.Element[] => {
  return [
    <div>
      <input
        value={editedObj.name || ""}
        onChange={(e) => {
          const newOne = { ...editedObj };
          newOne.name = e.target.value;
          onChange(newOne);
        }}
      ></input>
    </div>,
    <div>
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
    </div>,
  ];
};

const updateEditor = (
  originalObj: Client,
  { editedObj, onSaveClick, onCancelClick, onChange }: EditorProps
): JSX.Element[] => {
  editedObj.id = originalObj.id;
  return editor({
    editedObj: editedObj,
    onSaveClick: onSaveClick,
    onCancelClick: onCancelClick,
    onChange: onChange,
    saveButtonName: "update",
  });
};

const addEditor = (props: EditorProps): JSX.Element[] => {
  return editor(props);
};

const createItem = (
  editedId: number | "new" | undefined,
  props: ViewProps & EditorProps
): JSX.Element[] => {
  if (editedId === props.originalObj.id) {
    return updateEditor(props.originalObj, props);
  } else {
    return view(props);
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

  const records: JSX.Element[][] = clients.map((obj) => {
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
      <Table
        thead={[<span>name</span>, <span>actions</span>]}
        rows={records}
      ></Table>
      <button onClick={startEditing}>add</button>
    </div>
  );
};

export default Clients;
