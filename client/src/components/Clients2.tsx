import { Collapse, List, ListItemText } from "@mui/material";
import { useEffect, useState } from "react";

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
  return <ListItemText key={deal.id}>{deal.name}</ListItemText>;
}

function clientListItem(client: Client): JSX.Element {
  return (
    <div key={client.id}>
      <ListItemText>{client.name}</ListItemText>
      <Collapse>
        <List>{client.deals.map(dealListItem)}</List>
      </Collapse>
    </div>
  );
}

function Clients(): JSX.Element {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    loadClients().then((cs) => {
      setClients(cs);
    });
  }, []);

  return <List>{clients.map(clientListItem)}</List>;
}

export default Clients;
