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
import { useNavigate } from "react-router-dom";
import { useClientEditor } from "./useClientEditor";
import { useClientSelector } from "./useClientSelector";
import { useDealEditor } from "./useDealEditor";

export type Client = {
  id: number;
  name: string;
  deals: { id: number; name: string }[];
};

export type Deal = {
  id: number;
  name: string;
  clientId?: number;
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

type DealListItemProps = {
  deal: Deal;
  onEditClick: (d: Deal) => Promise<void>;
};

function DealListItem({ deal, onEditClick }: DealListItemProps): JSX.Element {
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
            onEditClick(deal);
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
  onClick: (c: Client) => Promise<void>;
  onEditClick: (c: Client) => Promise<void>;
  onDealEditClick: (d: Deal) => Promise<void>;
};
function ClientListItem({
  client,
  selectedClientId,
  onClick,
  onEditClick,
  onDealEditClick,
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
              onEditClick(client);
            }}
          />
        </Button>
        <ListItemText primary={client.name} />
      </ListItemButton>
      <Collapse in={client.id === selectedClientId}>
        <List>
          {client.deals.map((d) => (
            <DealListItem key={d.id} deal={d} onEditClick={onDealEditClick} />
          ))}
        </List>
      </Collapse>
    </div>
  );
}

function ClientsPage(): JSX.Element {
  const loadClients = async () => {
    const cs = await doLoadClients();
    setClients(cs);
  };

  const [clients, setClients] = useState<Client[]>([]);
  const [openClientEditor, clientEditorDialog] = useClientEditor(loadClients);
  const [openDealEditor, dealEditorDialog] = useDealEditor(
    clients,
    loadClients
  );
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
                onEditClick={openClientEditor}
                onDealEditClick={openDealEditor}
              />
            ))}
          </List>
          <Button
            onClick={() => {
              openClientEditor();
            }}
          >
            <Add /> client
          </Button>
          <Button
            onClick={() => {
              openDealEditor();
            }}
          >
            <Add /> deal
          </Button>
        </Paper>
      </Box>
      {clientEditorDialog}
      {dealEditorDialog}
    </>
  );
}

export default ClientsPage;
