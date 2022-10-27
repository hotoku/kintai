import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { fetchClients, fetchDeals, postDeal, putDeal } from "../api/fetches";

import { Client, Deal, HalfwayDeal } from "../api/types";
import { maybeInt } from "../utils";
import { Table } from "./Table";

type FilterProps = {
  selectedClientId: number | undefined;
  clients: Client[];
  onChange: (id: number | undefined) => void;
};

const filter = ({
  selectedClientId,
  clients,
  onChange,
}: FilterProps): JSX.Element => {
  const choices = clients.map((c) => {
    return (
      <option key={c.id} value={c.id}>
        {c.id}: {c.name}
      </option>
    );
  });
  choices.push(<option key="undefined" value="undefined" />);
  return (
    <select
      value={selectedClientId}
      onChange={(e) =>
        onChange(
          e.target.value === "undefined" ? undefined : parseInt(e.target.value)
        )
      }
    >
      {choices}
    </select>
  );
};

type ViewProps = {
  originalObj: Deal;
  onEditClick: (obj: Deal) => void;
};

const view = ({ originalObj, onEditClick }: ViewProps): JSX.Element[] => {
  return [
    <div>
      <Link to={`/workHours?dealId=${originalObj.id}`}>{originalObj.name}</Link>
    </div>,
    <div>{originalObj.clientName}</div>,
    <div>
      <button onClick={() => onEditClick(originalObj)}>edit</button>
    </div>,
  ];
};

type EditorProps = {
  editedObj: HalfwayDeal;
  onChange: (obj: HalfwayDeal) => void;
  onSaveClick: (obj: HalfwayDeal) => void;
  onCancelClick: (obj: HalfwayDeal) => void;
  saveButtonLabel: string;
  clients: Client[];
};
const editor = ({
  editedObj,
  onChange,
  onSaveClick,
  onCancelClick,
  saveButtonLabel,
  clients,
}: EditorProps): JSX.Element[] => {
  const choices = clients.map((c) => {
    return (
      <option key={c.id} value={c.id}>
        {c.id}: {c.name}
      </option>
    );
  });
  choices.push(<option key="undefined" value="undefined" />);
  return [
    <div>
      <input
        value={editedObj.name || ""}
        onChange={(e) => {
          const newOne = { ...editedObj };
          newOne.name = e.target.value;
          onChange(newOne);
        }}
      />
    </div>,
    <div>
      <select
        value={editedObj.clientId || "undefined"}
        onChange={(e) => {
          const newOne = { ...editedObj };
          newOne.clientId = parseInt(e.target.value) || undefined;
          onChange(newOne);
        }}
      >
        {choices}
      </select>
    </div>,
    <div>
      <button onClick={() => onSaveClick(editedObj)}>{saveButtonLabel}</button>
      <button onClick={() => onCancelClick(editedObj)}>cancel</button>
    </div>,
  ];
};

const updateEditor = (props: EditorProps): JSX.Element[] => {
  return editor(props);
};

const addEditor = (props: EditorProps): JSX.Element[] => {
  return editor(props);
};

const createItem = (
  editedId: number | "new" | undefined,
  props: EditorProps & ViewProps
): JSX.Element[] => {
  if (editedId === props.originalObj.id) {
    return updateEditor(props);
  } else {
    return view(props);
  }
};

type DealsProp = {
  clientId?: string;
};

const Deals = ({ clientId }: DealsProp) => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [editedRecord, setEditedRecord] = useState<HalfwayDeal>({});
  const [editedId, setEditedId] = useState<number | "new" | undefined>();
  const [selectedClientId, setSelectedClientId] = useState<number | undefined>(
    maybeInt(clientId)
  );
  const navigate = useNavigate();

  useEffect(() => {
    fetchDeals().then(setDeals);
    fetchClients().then(setClients);
  }, []);

  const startAdding = () => {
    setEditedId("new");
    setEditedRecord({});
  };

  const enableEditing = (obj: HalfwayDeal) => {
    setEditedId(obj.id);
    setEditedRecord({ ...obj });
  };

  const disableEditing = () => {
    setEditedId(undefined);
    setEditedRecord({});
  };

  const addDeal = async (obj: HalfwayDeal) => {
    if (obj.name === undefined || obj.clientId === undefined) {
      return;
    }
    await postDeal({
      name: obj.name,
      clientId: obj.clientId,
    });
    disableEditing();
    fetchDeals().then(setDeals);
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
    fetchDeals().then(setDeals);
  };

  const onClientSelect = (n: number | undefined): void => {
    setSelectedClientId(n);
    const url = "/deals" + (n === undefined ? "" : `?clientId=${n}`);
    navigate(url);
  };

  const records: JSX.Element[][] = deals
    .filter(
      (obj) =>
        selectedClientId === undefined || selectedClientId === obj.clientId
    )
    .map((obj) =>
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
    );

  if (editedId === "new") {
    records.push(
      addEditor({
        editedObj: editedRecord,
        onChange: setEditedRecord,
        onSaveClick: addDeal,
        onCancelClick: disableEditing,
        saveButtonLabel: "save",
        clients: clients,
      })
    );
  }

  return (
    <div className="Deals">
      {filter({
        selectedClientId: selectedClientId,
        clients: clients,
        onChange: onClientSelect,
      })}
      <Table
        thead={[<div>name</div>, <div>client name</div>, <div>actions</div>]}
        rows={records}
      ></Table>
      <button onClick={startAdding}>add</button>
    </div>
  );
};

export default Deals;
