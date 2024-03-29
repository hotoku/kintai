import {
  Box,
  Button,
  Dialog,
  Input,
  MenuItem,
  Select,
  Switch,
} from "@mui/material";
import { useState } from "react";
import { Client } from ".";
import { postDeal, putDeal } from "../../api/fetches";
import { Deal } from "../../api/types";
import { maybeInt } from "../../utils";

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
  clients: Client[],
  afterSave: () => Promise<void>
): [(d?: Deal) => Promise<void>, JSX.Element] {
  const [isOpen, setIsOpen] = useState(false);
  const [object, setObject] = useState<Partial<Deal>>({ name: "" });
  const [clientId, setClientId] = useState<number | "">(
    object && object.clientId ? object.clientId : ""
  );

  const open = async (d: Deal | undefined) => {
    setIsOpen(true);
    if (d && d.clientId) {
      setClientId(d.clientId);
    }
    setObject(d ?? {});
  };
  const close = () => {
    setObject({});
    setClientId("");
    setIsOpen(false);
  };
  const canSave =
    typeof clientId === "number" && object.name && object.name.length > 0;

  const save = async () => {
    if (object.name === undefined) {
      return;
    }
    if (object.clientId === undefined) {
      return;
    }
    if (object.name === "") {
      return;
    }
    if (object.id) {
      await putDeal(object);
    } else {
      await postDeal(object);
    }
  };

  const dialog = (
    <Dialog open={isOpen} onClose={close}>
      <Box style={{ padding: 10 }}>
        <Box>
          <Select
            onChange={(e) => {
              const val = e.target.value;
              const val2 = maybeInt(val);
              setClientId(typeof val == "number" ? val : "");
              setObject({ ...object, clientId: val2 });
            }}
            value={clientId}
          >
            {menuItem(clients)}
          </Select>
          <Switch
            checked={object.isFinished ?? false}
            onChange={() => {
              setObject({ ...object, isFinished: !object.isFinished });
            }}
          ></Switch>
        </Box>
        <Box>
          <label>
            deal name{" "}
            <Input
              value={object && object.name ? object.name : ""}
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
        </Box>
        <Button
          disabled={!canSave}
          style={{ marginLeft: 5 }}
          variant="contained"
          onClick={() => {
            save().then(() => afterSave());
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
