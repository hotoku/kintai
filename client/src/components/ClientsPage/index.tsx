import { Add, Label } from "@mui/icons-material";
import {
  Box,
  Button,
  Collapse,
  Dialog,
  Input,
  List,
  ListItemButton,
  ListItemText,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { postClient } from "../../api/fetches";

type Client = {
  id: number;
  name: string;
  deals: { id: number; name: string }[];
};

type Deal = {
  id: number;
  name: string;
};

type ClientEditorDialogProps = {
  open: boolean;
};

function ClientEditorDialog({ open }: ClientEditorDialogProps): JSX.Element {
  return <Dialog open={open}></Dialog>;
}

async function loadClients(): Promise<Client[]> {
  const ret = await fetch("/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        {
          clients: getAllClients {
            id
            name
            deals {
              id
              name
            } 
          }
        }
      `,
    }),
  });
  return (await ret.json()).data.clients;
}

function dealListItem(deal: Deal): JSX.Element {
  return (
    <ListItemButton
      key={deal.id}
      sx={{ pl: 4 }}
      component={Link}
      to={`/workHours?dealId=${deal.id}`}
    >
      {deal.name}
    </ListItemButton>
  );
}

type ClientListItemProps = {
  client: Client;
  selectedClientId?: number;
  onClick: (c: Client) => void;
};
function ClientListItem({
  client,
  selectedClientId,
  onClick,
}: ClientListItemProps): JSX.Element {
  return (
    <div>
      <ListItemButton
        onClick={() => {
          onClick(client);
        }}
      >
        <ListItemText primary={client.name} />
      </ListItemButton>
      <Collapse in={client.id === selectedClientId}>
        <List>{client.deals.map(dealListItem)}</List>
      </Collapse>
    </div>
  );
}

function useClientEditor(afterSave: () => void) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [object, setObject] = useState<Partial<Client>>({ name: "" });
  const open = () => {
    setIsOpen(true);
  };
  const close = () => {
    setIsOpen(false);
  };
  const save = async () => {
    await postClient(object);
  };
  const canSave = object.name !== undefined && object.name.length > 0;
  const dialog = (
    <Dialog open={isOpen} onClose={close}>
      <Box style={{ padding: 10 }}>
        <label>
          client name{" "}
          <Input
            value={object.name}
            onChange={(e) =>
              setObject((o) => {
                return {
                  ...o,
                  name: e.target.value,
                };
              })
            }
          />
        </label>
        <Button
          disabled={!canSave}
          style={{ marginLeft: 5 }}
          variant="contained"
          onClick={() => {
            save().then(() => {
              afterSave();
            });
            close();
          }}
        >
          save
        </Button>
      </Box>
    </Dialog>
  );
  return [open, dialog] as [() => void, JSX.Element];
}

function ClientsPage(): JSX.Element {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<
    number | undefined
  >();

  const afterSave = () => {
    loadClients().then((cs) => {
      setClients(cs);
    });
  };

  const [openEditor, editorDialog] = useClientEditor(afterSave);

  useEffect(() => {
    loadClients().then((cs) => {
      setClients(cs);
    });
  }, []);

  const handleClientClick = (client: Client) => {
    if (selectedClientId === client.id) {
      setSelectedClientId(undefined);
    } else {
      setSelectedClientId(client.id);
    }
  };

  return (
    <>
      <Box style={{ padding: 10 }}>
        <Paper>
          <List>
            {clients.map((client) => (
              <ClientListItem
                key={client.id}
                client={client}
                selectedClientId={selectedClientId}
                onClick={handleClientClick}
              />
            ))}
          </List>
          <Button
            onClick={() => {
              openEditor();
            }}
          >
            <Add />
          </Button>
        </Paper>
      </Box>
      {editorDialog}
    </>
  );
}

export default ClientsPage;
