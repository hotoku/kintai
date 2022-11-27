import { useEffect, useState } from "react";
import { Client } from "../graphql/types";

async function loadClients(): Promise<Client[]> {
  const ret = await fetch("/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        {
          clients: getClient(id: 1) {
            id
            name
          }
        }
      `,
    }),
  });
  const ret2 = (await ret.json()).data.clients;
  console.log(ret2);
  return [];
}

function Clients(): JSX.Element {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    loadClients().then((cs) => {
      setClients(cs);
    });
  }, []);

  return <div> client</div>;
}

export default Clients;
