import { Box, Dialog } from "@mui/material";
import { useState } from "react";
import { Client } from ".";

export function useDealEditor(
  clients: Client[]
): [() => Promise<void>, JSX.Element] {
  const [isOpen, setIsOpen] = useState(false);
  const open = async () => {
    setIsOpen(true);
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
