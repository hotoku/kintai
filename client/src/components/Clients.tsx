import { useEffect, useState } from "react";
import { fetchClients } from "../api/fetches";
import { Client } from "../api/types";

const createItem = (client: Client): JSX.Element => {
  return (
    <tr key={client.id}>
      <td>{client.name}</td>
    </tr>
  );
};

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    fetchClients(setClients);
  }, []);
  return (
    <div className="Clients">
      <table>
        <thead>
          <tr>
            <th>name</th>
          </tr>
        </thead>
        <tbody>{clients.map(createItem)}</tbody>
      </table>
    </div>
  );
};

export default Clients;
