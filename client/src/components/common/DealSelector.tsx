import { Box, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useState } from "react";
import { maybeInt } from "../../utils";

export type ClientMap = Map<number, string>;
export type DealMap = Map<number, string>;

type DealSelectorProps = {
  clients: ClientMap;
  deals: DealMap;
  onClientChange: (id: number | "") => Promise<void>;
  onDealChange: (id: number | "") => Promise<void>;
};

function menuItem(map: Map<number, string>): JSX.Element[] {
  const ret = [] as JSX.Element[];
  ret.push(
    <MenuItem key={"none"} value="">
      <em>All</em>
    </MenuItem>
  );
  map.forEach((name, id) => {
    ret.push(
      <MenuItem key={id} value={id}>
        {name}
      </MenuItem>
    );
  });
  return ret;
}

function DealSelector({
  clients,
  deals,
  onClientChange,
  onDealChange,
}: DealSelectorProps): JSX.Element {
  const [clientId, setClientId] = useState<number | "">("");
  const [dealId, setDealId] = useState<number | "">("");

  const handleStateChange = (
    handlers: ((id: number | "") => void)[],
    name: string
  ): ((e: SelectChangeEvent<number>) => void) => {
    return (e: SelectChangeEvent<number>) => {
      console.log("handleStateChange", name);
      for (const h of handlers) {
        const v = e.target.value;
        const id = typeof v === "string" ? maybeInt(v) : v;
        h(id ?? "");
      }
    };
  };

  const clearDealId = () => {
    setDealId("");
    onDealChange("");
  };
  console.log("deal selector");

  return (
    <Box style={{ marginLeft: "10px" }}>
      <Select
        onChange={handleStateChange(
          [onClientChange, setClientId, clearDealId],
          "client change"
        )}
        value={clientId}
      >
        {menuItem(clients)}
      </Select>
      <Select
        onChange={handleStateChange([onDealChange, setDealId], "deal change")}
        value={dealId}
      >
        {menuItem(deals)}
      </Select>
    </Box>
  );
}

export default DealSelector;
