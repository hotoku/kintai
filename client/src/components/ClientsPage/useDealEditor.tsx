import { Box, Dialog } from "@mui/material";
import { useState } from "react";
import { Client, Deal } from ".";

export function useDealEditor(
  clients: Client[]
): [(d?: Deal) => Promise<void>, JSX.Element] {
  const [isOpen, setIsOpen] = useState(false);
  const [obj, setObj] = useState<Partial<Deal>>();
  const open = async (d: Deal | undefined) => {
    setIsOpen(true);
    setObj(d ?? {});
  };
  const close = () => {
    setIsOpen(false);
  };
  const dialog = (
    <Dialog open={isOpen} onClose={close}>
      <Box style={{ padding: 10 }}>{clients.map((c) => c.name)}</Box>
    </Dialog>
  );
  return [open, dialog];
}
