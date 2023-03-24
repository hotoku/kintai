import { Box, Button, Dialog, Input, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { Client, Deal } from ".";

function menuItem(items: { id: number; name: string }[]): JSX.Element[] {
  const ret = [] as JSX.Element[];
  ret.push(
    <MenuItem key={"none"} value="">
      <em>-</em>
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

export function useDealEditor(
  clients: Client[]
): [(d?: Deal) => Promise<void>, JSX.Element] {
  const [isOpen, setIsOpen] = useState(false);
  const [obj, setObj] = useState<Partial<Deal>>({});
  const [clientId, setClientId] = useState<number | "">(
    obj && obj.clientId ? obj.clientId : ""
  );

  const open = async (d: Deal | undefined) => {
    setIsOpen(true);
    setObj(d ?? {});
  };
  const close = () => {
    setIsOpen(false);
  };
  const canSave =
    typeof clientId === "number" && obj.name && obj.name.length > 0;
  const dialog = (
    <Dialog open={isOpen} onClose={close}>
      <Box style={{ padding: 10 }}>
        <Box>
          <Select
            onChange={(e) => {
              const val = e.target.value;
              setClientId(typeof val == "number" ? val : "");
            }}
            value={clientId}
          >
            {menuItem(clients)}
          </Select>
        </Box>
        <Box>
          <label>
            deal name{" "}
            <Input
              value={obj && obj.name ? obj.name : ""}
              onChange={(e) =>
                setObj((o) => {
                  return {
                    ...o,
                    name: e.target.value,
                  };
                })
              }
            />
          </label>
        </Box>
        <Button
          disabled={!canSave}
          style={{ marginLeft: 5 }}
          variant="contained"
          onClick={() => {
            // save().then(() => {
            //   afterSave();
            // });
            close();
          }}
        >
          save
        </Button>
      </Box>
    </Dialog>
  );
  return [open, dialog];
}
