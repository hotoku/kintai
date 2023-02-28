import { Collapse, List, ListItemButton, ListItemText } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Client = {
  id: number;
  name: string;
  deals: { id: number; name: string }[];
};

type Deal = {
  id: number;
  name: string;
};

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

function ClientsPage(): JSX.Element {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<
    number | undefined
  >();

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
  );
}

export default ClientsPage;
