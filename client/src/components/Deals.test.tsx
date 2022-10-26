import { unmountComponentAtNode } from "react-dom";
import {
  getAllByRole,
  getAllByText,
  getByRole,
  render,
  screen,
} from "@testing-library/react";

import * as fetches from "../api/fetches";

import Deals from "./Deals";
import { Client, Deal } from "../api/types";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

let container: HTMLDivElement | null = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  if (container === null) return;
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test("render deals", async () => {
  const makeDeal = (data: [number, number]): Deal => {
    return {
      id: data[0],
      name: `deal ${data[0]}`,
      clientId: data[1],
      clientName: `client ${data[1]}`,
    };
  };

  const makeClient = (data: [number]): Client => {
    return {
      id: data[0],
      name: `client ${data[0]}`,
    };
  };

  const fakeDeals = (
    [
      [1, 1],
      [2, 1],
      [3, 1],
      [4, 2],
    ] as [number, number][]
  ).map(makeDeal);

  const fakeClients = ([[1], [2]] as [number][]).map(makeClient);

  const spy1 = jest.spyOn(fetches, "fetchClients");
  spy1.mockImplementation(
    jest.fn((cb: (clients: Client[]) => void) => {
      cb(fakeClients);
    }) as jest.Mock
  );

  const spy2 = jest.spyOn(fetches, "fetchDeals");
  spy2.mockImplementation(
    jest.fn((cb: (deals: Deal[]) => void) => {
      cb(fakeDeals);
    }) as jest.Mock
  );

  render(<Deals clientId={"1"} />, { wrapper: BrowserRouter });

  // screen.debug();

  /* There is a table, including 4 rows (1 header + 3 record). */
  const table = screen.getByRole("table");
  const rows = getAllByRole(table, "row");
  expect(rows.length).toBe(4);

  /* There are 3 cells including client name "client 1" */
  const client1 = getAllByText(table, "client 1");
  expect(client1.length).toBe(3);

  /* There are 3 edit buttons. */
  const editButtons = getAllByRole(table, "button", { name: "edit" });
  expect(editButtons.length).toBe(3);

  /* When click one of edit buttons, it will be replaced with an update and a cancel buttons. */
  userEvent.click(editButtons[0]);
  const editButtons2 = getAllByRole(table, "button", { name: "edit" });
  expect(editButtons2.length).toBe(2);

  const updateButton = getByRole(table, "button", { name: "update" });
  expect(updateButton).not.toBeNull();
  const cancelButton = getByRole(table, "button", { name: "cancel" });
  expect(cancelButton).not.toBeNull();

  /* When click cancel button, it will be replaced with an edit button. */
  userEvent.click(cancelButton);
  const editButtons3 = getAllByRole(table, "button", { name: "edit" });
  expect(editButtons3.length).toBe(3);

  spy1.mockRestore();
  spy2.mockRestore();
});
