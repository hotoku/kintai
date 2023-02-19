import { Box, Select, SelectChangeEvent } from "@mui/material";
import { useState } from "react";

type DealSelectorProps = {
  clients: ClientMap;
  deals: DealMap;
  onClientChange: (id: number | "") => Promise<void>;
  onDealChange: (id: number | "") => Promise<void>;
};

function DealSelector({
  clients,
  deals,
  onClientChange,
  onDealChange,
}: DealSelectorProps): JSX.Element {
  const [clientId, setClientId] = useState<number | "">("");
  const [dealId, setDealId] = useState<number | "">("");

  const handleStateChange = (
    handlers: ((id: number | "") => void)[]
  ): ((e: SelectChangeEvent<number>) => void) => {
    return (e: SelectChangeEvent<number>) => {
      for (const h of handlers) {
        const v = e.target.value;
        const id = typeof v === "string" ? maybeInt(v) : v;
        h(id);
      }
    };
  };

  const clearDealId = () => {
    setDealId("");
    onDealChange("");
  };

  return (
    <Box style={{ marginLeft: "10px" }}>
      <Select
        onChange={handleStateChange([onClientChange, setClientId, clearDealId])}
        value={clientId}
      >
        {menuItem(clients)}
      </Select>
      <Select
        onChange={handleStateChange([onDealChange, setDealId])}
        value={dealId}
      >
        {menuItem(deals)}
      </Select>
    </Box>
  );
}
