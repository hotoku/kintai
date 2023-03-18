import { Add, Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  Collapse,
  List,
  ListItemButton,
  ListItemText,
  Paper,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useClientEditor } from "./useClientEditor";
import { useClientSelector } from "./useClientSelector";

export type Client = {
  id: number;
  name: string;
  deals: { id: number; name: string }[];
};

type Deal = {
  id: number;
  name: string;
};

async function doLoadClients(): Promise<Client[]> {
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

function DealListItem(deal: Deal): JSX.Element {
  const navigate = useNavigate();

  return (
    <ListItemButton
      key={deal.id}
      sx={{ pl: 4 }}
      onClick={() => {
        const url = `/workHours?dealId=${deal.id}`;
        navigate(url);
      }}
    >
      <Button
        style={{
          paddingTop: 0,
          paddingBottom: 0,
        }}
      >
        <Edit
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      </Button>
      <ListItemText> {deal.name}</ListItemText>
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
        <Button
          style={{
            paddingTop: 0,
            paddingBottom: 0,
          }}
        >
          <Edit
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        </Button>
        <ListItemText primary={client.name} />
      </ListItemButton>
      <Collapse in={client.id === selectedClientId}>
        <List>{client.deals.map(DealListItem)}</List>
      </Collapse>
    </div>
  );
}

function ClientsPage(): JSX.Element {
  const loadClients = () => {
    doLoadClients().then((cs) => {
      setClients(cs);
    });
  };

  const [clients, setClients] = useState<Client[]>([]);
  const [openEditor, editorDialog] = useClientEditor(loadClients);
  const [selectedClientId, handleClientClick] = useClientSelector();

  useEffect(() => {
    loadClients();
  }, []);

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
            <Add /> client
          </Button>
          <Button onClick={() => {}}>
            <Add /> deal
          </Button>
        </Paper>
      </Box>
      {editorDialog}
    </>
  );
}

export default ClientsPage;
