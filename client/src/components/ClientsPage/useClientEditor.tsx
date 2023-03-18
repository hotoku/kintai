import { Box, Button, Dialog, Input } from "@mui/material";
import { useState } from "react";
import { Client } from ".";
import { postClient } from "../../api/fetches";

export function useClientEditor(afterSave: () => void) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [object, setObject] = useState<Partial<Client>>({ name: "" });
  const open = () => {
    setIsOpen(true);
  };
  const close = () => {
    setIsOpen(false);
  };
  const save = async () => {
    await postClient(object);
  };
  const canSave = object.name !== undefined && object.name.length > 0;
  const dialog = (
    <Dialog open={isOpen} onClose={close}>
      <Box style={{ padding: 10 }}>
        <label>
          client name{" "}
          <Input
            value={object.name}
            onChange={(e) =>
              setObject((o) => {
                return {
                  ...o,
                  name: e.target.value,
                };
              })
            }
          />
        </label>
        <Button
          disabled={!canSave}
          style={{ marginLeft: 5 }}
          variant="contained"
          onClick={() => {
            save().then(() => {
              afterSave();
            });
            close();
          }}
        >
          save
        </Button>
      </Box>
    </Dialog>
  );
  return [open, dialog] as [() => void, JSX.Element];
}
