import { Box, Button, Dialog, Input } from "@mui/material";
import { useState } from "react";
import { Client } from ".";
import { postClient, putClient } from "../../api/fetches";

export function useClientEditor(
  afterSave: () => void
): [(c?: Client) => void, JSX.Element] {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [object, setObject] = useState<Partial<Client>>({ name: "" });
  const open = (obj: Client | undefined) => {
    setIsOpen(true);
    if (obj) {
      setObject(obj);
    } else {
      setObject({ name: "" });
    }
  };
  const close = () => {
    setIsOpen(false);
  };
  const save = async () => {
    if (object.name === undefined) {
      return;
    }
    if (object.name === "") {
      return;
    }
    if (!object.id) {
      await postClient(object);
    } else {
      await putClient({
        id: object.id,
        name: object.name,
      });
    }
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
  return [open, dialog];
}
