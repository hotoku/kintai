import { useState } from "react";
import { Client } from ".";

export function useClientSelector(): [
  number | undefined,
  (c: Client) => Promise<void>
] {
  const [selectedClientId, setSelectedClientId] = useState<
    number | undefined
  >();

  const handleClientClick = async (client: Client) => {
    if (selectedClientId === client.id) {
      setSelectedClientId(undefined);
    } else {
      setSelectedClientId(client.id);
    }
  };

  return [selectedClientId, handleClientClick];
}
