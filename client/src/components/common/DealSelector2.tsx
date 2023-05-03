import { Box, MenuItem, Select } from "@mui/material";
import { useMemo, useState } from "react";
import { Deal } from "../../api/types";

export type Client = {
  id: number;
  name: string;
  deals: Pick<Deal, "id" | "name" | "clientId" | "isFinished">[];
};

export type Selection = {
  clientId: number | "";
  dealId: number | "";
};

type DealSelectorProps = {
  clients: Client[];
  onSelectionChange: (s: Selection) => Promise<void>;
};

function menuItem(items: { id: number; name: string }[]): JSX.Element[] {
  const ret = [] as JSX.Element[];
  ret.push(
    <MenuItem key={"none"} value="">
      <em>All</em>
    </MenuItem>
  );
  items.forEach((item) => {
    ret.push(
      <MenuItem key={item.id} value={item.id}>
        {item.name}
      </MenuItem>
    );
  });
  return ret;
}

function DealSelector({
  clients,
  onSelectionChange,
}: DealSelectorProps): JSX.Element {
  const [selection, setSelection] = useState<Selection>({
    clientId: "",
    dealId: "",
  });

  const deals = useMemo(() => {
    if (typeof selection.clientId === "number") {
      const client = clients.find((c) => c.id === selection.clientId);
      if (client === undefined) {
        throw new Error("panic");
      }
      return client.deals;
    } else {
      return clients.map((c) => c.deals).flat();
    }
  }, [selection.clientId, clients]);

  return (
    <Box>
      <Select
        onChange={(e) => {
          const v = e.target.value;
          const id = typeof v === "string" ? "" : v;
          const newSelection: Selection = {
            clientId: id,
            dealId: "",
          };
          setSelection(newSelection);
          onSelectionChange(newSelection);
        }}
        value={selection.clientId}
      >
        {menuItem(clients)}
      </Select>
      <Select
        onChange={(e) => {
          const v = e.target.value;
          const id = typeof v === "string" ? "" : v;
          if (id === "") {
            const newSelection: Selection = {
              ...selection,
              dealId: "",
            };
            setSelection(newSelection);
            onSelectionChange(newSelection);
          } else {
            const clientId = (() => {
              for (const c of clients) {
                for (const d of c.deals) {
                  if (d.id === id) {
                    return c.id;
                  }
                }
              }
              throw new Error("panic");
            })();
            const newSelection: Selection = {
              clientId: clientId,
              dealId: id,
            };
            setSelection(newSelection);
            onSelectionChange(newSelection);
          }
        }}
        value={selection.dealId}
      >
        {menuItem(deals)}
      </Select>
    </Box>
  );
}

export default DealSelector;
